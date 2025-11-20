"""
Blockchain-based Trust Passport System
Real-world implementation using cryptographic hashing and distributed ledger concepts
"""

import hashlib
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import uuid
from dataclasses import dataclass, asdict
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
import sqlite3
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Transaction:
    transaction_id: str
    customer_id: str
    timestamp: str
    transaction_type: str
    amount: float
    merchant_id: str
    location: str
    device_fingerprint: str
    trust_score_before: int
    trust_score_after: int
    fraud_indicators: List[str]
    verification_method: str

@dataclass
class TrustBlock:
    block_id: str
    previous_hash: str
    timestamp: str
    transactions: List[Transaction]
    merkle_root: str
    nonce: int
    difficulty: int
    miner_id: str
    block_hash: str

class TrustPassportSystem:
    def __init__(self, db_path: str = "trust_passport.db"):
        self.db_path = db_path
        self.blockchain: List[TrustBlock] = []
        self.pending_transactions: List[Transaction] = []
        self.customer_trust_scores: Dict[str, int] = {}
        self.difficulty = 4  # Mining difficulty
        self.mining_reward = 10
        
        # Initialize database
        self._init_database()
        
        # Load existing blockchain
        self._load_blockchain()
        
        # Generate genesis block if blockchain is empty
        if not self.blockchain:
            self._create_genesis_block()
    
    def _init_database(self):
        """Initialize SQLite database for persistent storage"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS blocks (
                block_id TEXT PRIMARY KEY,
                previous_hash TEXT,
                timestamp TEXT,
                merkle_root TEXT,
                nonce INTEGER,
                difficulty INTEGER,
                miner_id TEXT,
                block_hash TEXT,
                transactions_json TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customer_trust (
                customer_id TEXT PRIMARY KEY,
                trust_score INTEGER,
                last_updated TEXT,
                transaction_count INTEGER,
                fraud_incidents INTEGER,
                verification_level TEXT
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS trust_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_id TEXT,
                old_score INTEGER,
                new_score INTEGER,
                change_reason TEXT,
                timestamp TEXT,
                transaction_id TEXT
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def _load_blockchain(self):
        """Load blockchain from database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM blocks ORDER BY timestamp')
        rows = cursor.fetchall()
        
        for row in rows:
            transactions_data = json.loads(row[8])
            transactions = [Transaction(**tx) for tx in transactions_data]
            
            block = TrustBlock(
                block_id=row[0],
                previous_hash=row[1],
                timestamp=row[2],
                transactions=transactions,
                merkle_root=row[3],
                nonce=row[4],
                difficulty=row[5],
                miner_id=row[6],
                block_hash=row[7]
            )
            self.blockchain.append(block)
        
        # Load customer trust scores
        cursor.execute('SELECT customer_id, trust_score FROM customer_trust')
        trust_rows = cursor.fetchall()
        
        for customer_id, trust_score in trust_rows:
            self.customer_trust_scores[customer_id] = trust_score
        
        conn.close()
        logger.info(f"Loaded {len(self.blockchain)} blocks from database")
    
    def _create_genesis_block(self):
        """Create the first block in the blockchain"""
        genesis_transaction = Transaction(
            transaction_id="GENESIS",
            customer_id="SYSTEM",
            timestamp=datetime.now().isoformat(),
            transaction_type="GENESIS",
            amount=0.0,
            merchant_id="SYSTEM",
            location="SYSTEM",
            device_fingerprint="SYSTEM",
            trust_score_before=0,
            trust_score_after=0,
            fraud_indicators=[],
            verification_method="SYSTEM"
        )
        
        genesis_block = TrustBlock(
            block_id="GENESIS",
            previous_hash="0" * 64,
            timestamp=datetime.now().isoformat(),
            transactions=[genesis_transaction],
            merkle_root=self._calculate_merkle_root([genesis_transaction]),
            nonce=0,
            difficulty=0,
            miner_id="SYSTEM",
            block_hash=""
        )
        
        genesis_block.block_hash = self._calculate_block_hash(genesis_block)
        self.blockchain.append(genesis_block)
        self._save_block_to_db(genesis_block)
        
        logger.info("Genesis block created")
    
    def add_transaction(self, transaction_data: Dict) -> str:
        """Add a new transaction to the pending pool"""
        # Get current trust score
        customer_id = transaction_data['customer_id']
        current_trust_score = self.get_customer_trust_score(customer_id)
        
        # Calculate new trust score based on transaction
        new_trust_score = self._calculate_new_trust_score(customer_id, transaction_data)
        
        transaction = Transaction(
            transaction_id=str(uuid.uuid4()),
            customer_id=customer_id,
            timestamp=datetime.now().isoformat(),
            transaction_type=transaction_data.get('type', 'PURCHASE'),
            amount=transaction_data.get('amount', 0.0),
            merchant_id=transaction_data.get('merchant_id', 'UNKNOWN'),
            location=transaction_data.get('location', 'UNKNOWN'),
            device_fingerprint=transaction_data.get('device_fingerprint', 'UNKNOWN'),
            trust_score_before=current_trust_score,
            trust_score_after=new_trust_score,
            fraud_indicators=transaction_data.get('fraud_indicators', []),
            verification_method=transaction_data.get('verification_method', 'STANDARD')
        )
        
        self.pending_transactions.append(transaction)
        
        # Update trust score
        self._update_customer_trust_score(customer_id, new_trust_score, transaction.transaction_id)
        
        logger.info(f"Transaction {transaction.transaction_id} added to pending pool")
        return transaction.transaction_id
    
    def mine_block(self, miner_id: str = "SYSTEM") -> Optional[TrustBlock]:
        """Mine a new block with pending transactions"""
        if not self.pending_transactions:
            return None
        
        # Get previous block hash
        previous_hash = self.blockchain[-1].block_hash if self.blockchain else "0" * 64
        
        # Create new block
        new_block = TrustBlock(
            block_id=str(uuid.uuid4()),
            previous_hash=previous_hash,
            timestamp=datetime.now().isoformat(),
            transactions=self.pending_transactions.copy(),
            merkle_root=self._calculate_merkle_root(self.pending_transactions),
            nonce=0,
            difficulty=self.difficulty,
            miner_id=miner_id,
            block_hash=""
        )
        
        # Mine the block (proof of work)
        start_time = time.time()
        while True:
            block_hash = self._calculate_block_hash(new_block)
            if block_hash.startswith("0" * self.difficulty):
                new_block.block_hash = block_hash
                break
            new_block.nonce += 1
        
        mining_time = time.time() - start_time
        
        # Add block to blockchain
        self.blockchain.append(new_block)
        self._save_block_to_db(new_block)
        
        # Clear pending transactions
        self.pending_transactions.clear()
        
        logger.info(f"Block {new_block.block_id} mined in {mining_time:.2f} seconds with nonce {new_block.nonce}")
        return new_block
    
    def get_customer_trust_score(self, customer_id: str) -> int:
        """Get current trust score for a customer"""
        return self.customer_trust_scores.get(customer_id, 50)  # Default score: 50
    
    def get_customer_trust_history(self, customer_id: str) -> List[Dict]:
        """Get trust score history for a customer"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT old_score, new_score, change_reason, timestamp, transaction_id
            FROM trust_history
            WHERE customer_id = ?
            ORDER BY timestamp DESC
            LIMIT 50
        ''', (customer_id,))
        
        history = []
        for row in cursor.fetchall():
            history.append({
                'old_score': row[0],
                'new_score': row[1],
                'change_reason': row[2],
                'timestamp': row[3],
                'transaction_id': row[4]
            })
        
        conn.close()
        return history
    
    def verify_blockchain_integrity(self) -> bool:
        """Verify the integrity of the entire blockchain"""
        for i in range(1, len(self.blockchain)):
            current_block = self.blockchain[i]
            previous_block = self.blockchain[i-1]
            
            # Verify previous hash
            if current_block.previous_hash != previous_block.block_hash:
                logger.error(f"Invalid previous hash in block {current_block.block_id}")
                return False
            
            # Verify block hash
            if current_block.block_hash != self._calculate_block_hash(current_block):
                logger.error(f"Invalid block hash in block {current_block.block_id}")
                return False
            
            # Verify merkle root
            if current_block.merkle_root != self._calculate_merkle_root(current_block.transactions):
                logger.error(f"Invalid merkle root in block {current_block.block_id}")
                return False
        
        logger.info("Blockchain integrity verified successfully")
        return True
    
    def _calculate_new_trust_score(self, customer_id: str, transaction_data: Dict) -> int:
        """Calculate new trust score based on transaction behavior"""
        current_score = self.get_customer_trust_score(customer_id)
        
        # Factors that affect trust score
        score_change = 0
        
        # Transaction amount factor
        amount = transaction_data.get('amount', 0)
        if amount > 1000:  # High-value transaction
            score_change -= 2
        elif amount < 10:  # Very low-value transaction
            score_change -= 1
        else:
            score_change += 1  # Normal transaction
        
        # Fraud indicators
        fraud_indicators = transaction_data.get('fraud_indicators', [])
        score_change -= len(fraud_indicators) * 5
        
        # Verification method
        verification = transaction_data.get('verification_method', 'STANDARD')
        if verification == 'BIOMETRIC':
            score_change += 3
        elif verification == 'TWO_FACTOR':
            score_change += 2
        
        # Transaction type
        tx_type = transaction_data.get('type', 'PURCHASE')
        if tx_type == 'RETURN':
            score_change -= 1
        elif tx_type == 'LOYALTY_REDEMPTION':
            score_change += 2
        
        # Calculate new score
        new_score = max(0, min(100, current_score + score_change))
        return new_score
    
    def _update_customer_trust_score(self, customer_id: str, new_score: int, transaction_id: str):
        """Update customer trust score in database"""
        old_score = self.get_customer_trust_score(customer_id)
        self.customer_trust_scores[customer_id] = new_score
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Update or insert customer trust record
        cursor.execute('''
            INSERT OR REPLACE INTO customer_trust 
            (customer_id, trust_score, last_updated, transaction_count, fraud_incidents, verification_level)
            VALUES (?, ?, ?, 
                    COALESCE((SELECT transaction_count FROM customer_trust WHERE customer_id = ?), 0) + 1,
                    COALESCE((SELECT fraud_incidents FROM customer_trust WHERE customer_id = ?), 0),
                    'STANDARD')
        ''', (customer_id, new_score, datetime.now().isoformat(), customer_id, customer_id))
        
        # Add to trust history
        cursor.execute('''
            INSERT INTO trust_history (customer_id, old_score, new_score, change_reason, timestamp, transaction_id)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (customer_id, old_score, new_score, 'Transaction behavior', datetime.now().isoformat(), transaction_id))
        
        conn.commit()
        conn.close()
    
    def _calculate_merkle_root(self, transactions: List[Transaction]) -> str:
        """Calculate Merkle root of transactions"""
        if not transactions:
            return hashlib.sha256(b"").hexdigest()
        
        # Create leaf hashes
        hashes = [hashlib.sha256(json.dumps(asdict(tx), sort_keys=True).encode()).hexdigest() 
                 for tx in transactions]
        
        # Build Merkle tree
        while len(hashes) > 1:
            if len(hashes) % 2 == 1:
                hashes.append(hashes[-1])  # Duplicate last hash if odd number
            
            new_hashes = []
            for i in range(0, len(hashes), 2):
                combined = hashes[i] + hashes[i+1]
                new_hashes.append(hashlib.sha256(combined.encode()).hexdigest())
            
            hashes = new_hashes
        
        return hashes[0]
    
    def _calculate_block_hash(self, block: TrustBlock) -> str:
        """Calculate hash for a block"""
        block_string = f"{block.block_id}{block.previous_hash}{block.timestamp}{block.merkle_root}{block.nonce}{block.difficulty}{block.miner_id}"
        return hashlib.sha256(block_string.encode()).hexdigest()
    
    def _save_block_to_db(self, block: TrustBlock):
        """Save block to database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        transactions_json = json.dumps([asdict(tx) for tx in block.transactions])
        
        cursor.execute('''
            INSERT INTO blocks (block_id, previous_hash, timestamp, merkle_root, nonce, difficulty, miner_id, block_hash, transactions_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (block.block_id, block.previous_hash, block.timestamp, block.merkle_root, 
              block.nonce, block.difficulty, block.miner_id, block.block_hash, transactions_json))
        
        conn.commit()
        conn.close()
    
    def get_blockchain_stats(self) -> Dict:
        """Get blockchain statistics"""
        total_transactions = sum(len(block.transactions) for block in self.blockchain)
        
        return {
            'total_blocks': len(self.blockchain),
            'total_transactions': total_transactions,
            'pending_transactions': len(self.pending_transactions),
            'total_customers': len(self.customer_trust_scores),
            'average_trust_score': sum(self.customer_trust_scores.values()) / len(self.customer_trust_scores) if self.customer_trust_scores else 0,
            'blockchain_size_mb': len(json.dumps([asdict(block) for block in self.blockchain])) / (1024 * 1024),
            'last_block_time': self.blockchain[-1].timestamp if self.blockchain else None
        }

# Initialize the trust passport system
if __name__ == "__main__":
    trust_system = TrustPassportSystem()
    
    # Test with sample transactions
    sample_transactions = [
        {
            'customer_id': 'CUST-001',
            'type': 'PURCHASE',
            'amount': 89.99,
            'merchant_id': 'WALMART-001',
            'location': 'New York, NY',
            'device_fingerprint': 'iOS-Safari-Trusted',
            'fraud_indicators': [],
            'verification_method': 'STANDARD'
        },
        {
            'customer_id': 'CUST-002',
            'type': 'PURCHASE',
            'amount': 2500.00,
            'merchant_id': 'WALMART-002',
            'location': 'Unknown',
            'device_fingerprint': 'Unknown-Browser',
            'fraud_indicators': ['high_amount', 'new_device', 'unusual_location'],
            'verification_method': 'STANDARD'
        }
    ]
    
    # Add transactions
    for tx_data in sample_transactions:
        tx_id = trust_system.add_transaction(tx_data)
        print(f"Added transaction: {tx_id}")
    
    # Mine a block
    block = trust_system.mine_block()
    if block:
        print(f"Mined block: {block.block_id}")
    
    # Verify blockchain
    is_valid = trust_system.verify_blockchain_integrity()
    print(f"Blockchain valid: {is_valid}")
    
    # Get stats
    stats = trust_system.get_blockchain_stats()
    print(f"Blockchain stats: {stats}")
