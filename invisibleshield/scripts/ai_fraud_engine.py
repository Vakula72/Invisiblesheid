"""
AI Fraud Detection Engine - Real-world implementation
Uses advanced machine learning models for fraud detection
"""

import numpy as np
import pandas as pd
import json
from datetime import datetime, timedelta
from sklearn.ensemble import IsolationForest, RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FraudDetectionEngine:
    def __init__(self):
        self.isolation_forest = IsolationForest(contamination=0.1, random_state=42)
        self.random_forest = RandomForestClassifier(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
        self.feature_columns = [
            'amount', 'hour_of_day', 'day_of_week', 'transaction_frequency',
            'avg_amount_last_30d', 'location_risk_score', 'device_trust_score',
            'account_age_days', 'failed_attempts_last_24h', 'velocity_score'
        ]
        
    def generate_training_data(self, num_samples=10000):
        """Generate realistic training data for fraud detection"""
        np.random.seed(42)
        
        # Generate legitimate transactions (90%)
        legitimate_samples = int(num_samples * 0.9)
        legitimate_data = []
        
        for _ in range(legitimate_samples):
            # Normal transaction patterns
            amount = np.random.lognormal(mean=3.5, sigma=1.2)  # $30-$300 typical
            hour = np.random.choice(range(9, 22), p=[0.05, 0.08, 0.12, 0.15, 0.15, 0.15, 0.12, 0.08, 0.05, 0.03, 0.02])
            day_of_week = np.random.choice(range(7), p=[0.12, 0.14, 0.14, 0.14, 0.16, 0.18, 0.12])
            
            legitimate_data.append({
                'amount': amount,
                'hour_of_day': hour,
                'day_of_week': day_of_week,
                'transaction_frequency': np.random.normal(15, 5),  # 15 transactions/month avg
                'avg_amount_last_30d': np.random.normal(85, 25),
                'location_risk_score': np.random.normal(20, 10),  # Low risk
                'device_trust_score': np.random.normal(85, 15),   # High trust
                'account_age_days': np.random.exponential(365),   # Account age
                'failed_attempts_last_24h': np.random.poisson(0.1),
                'velocity_score': np.random.normal(25, 10),       # Normal velocity
                'is_fraud': 0
            })
        
        # Generate fraudulent transactions (10%)
        fraud_samples = num_samples - legitimate_samples
        fraud_data = []
        
        for _ in range(fraud_samples):
            # Fraudulent transaction patterns
            amount = np.random.choice([
                np.random.lognormal(5.5, 0.8),  # High-value fraud
                np.random.lognormal(2.0, 0.5)   # Low-value testing
            ])
            hour = np.random.choice(range(24), p=[0.08, 0.06, 0.04, 0.03, 0.02, 0.02, 0.03, 0.04, 0.06, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.06, 0.06, 0.08, 0.08, 0.08, 0.08])
            
            fraud_data.append({
                'amount': amount,
                'hour_of_day': hour,
                'day_of_week': np.random.randint(0, 7),
                'transaction_frequency': np.random.normal(35, 15),  # High frequency
                'avg_amount_last_30d': np.random.normal(150, 50),
                'location_risk_score': np.random.normal(75, 20),    # High risk
                'device_trust_score': np.random.normal(35, 20),     # Low trust
                'account_age_days': np.random.exponential(30),      # New accounts
                'failed_attempts_last_24h': np.random.poisson(2),
                'velocity_score': np.random.normal(80, 25),         # High velocity
                'is_fraud': 1
            })
        
        # Combine and shuffle data
        all_data = legitimate_data + fraud_data
        np.random.shuffle(all_data)
        
        return pd.DataFrame(all_data)
    
    def train_models(self):
        """Train the fraud detection models"""
        logger.info("Generating training data...")
        df = self.generate_training_data()
        
        # Prepare features
        X = df[self.feature_columns]
        y = df['is_fraud']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train Isolation Forest (unsupervised anomaly detection)
        logger.info("Training Isolation Forest...")
        self.isolation_forest.fit(X_train_scaled[y_train == 0])  # Train on legitimate transactions only
        
        # Train Random Forest (supervised classification)
        logger.info("Training Random Forest...")
        self.random_forest.fit(X_train_scaled, y_train)
        
        # Evaluate models
        logger.info("Evaluating models...")
        
        # Isolation Forest predictions
        iso_pred = self.isolation_forest.predict(X_test_scaled)
        iso_pred = np.where(iso_pred == -1, 1, 0)  # Convert to fraud labels
        
        # Random Forest predictions
        rf_pred = self.random_forest.predict(X_test_scaled)
        
        logger.info("Isolation Forest Results:")
        logger.info(f"\n{classification_report(y_test, iso_pred)}")
        
        logger.info("Random Forest Results:")
        logger.info(f"\n{classification_report(y_test, rf_pred)}")
        
        self.is_trained = True
        
        # Save models
        self.save_models()
        
        return {
            'isolation_forest_accuracy': np.mean(iso_pred == y_test),
            'random_forest_accuracy': np.mean(rf_pred == y_test),
            'training_samples': len(df)
        }
    
    def predict_fraud(self, transaction_features):
        """Predict fraud probability for a transaction"""
        if not self.is_trained:
            logger.warning("Models not trained. Loading saved models...")
            self.load_models()
        
        # Prepare features
        features_df = pd.DataFrame([transaction_features])
        features_scaled = self.scaler.transform(features_df[self.feature_columns])
        
        # Get predictions from both models
        iso_anomaly = self.isolation_forest.predict(features_scaled)[0]
        iso_score = self.isolation_forest.decision_function(features_scaled)[0]
        
        rf_fraud_prob = self.random_forest.predict_proba(features_scaled)[0][1]
        rf_prediction = self.random_forest.predict(features_scaled)[0]
        
        # Combine predictions (ensemble approach)
        anomaly_weight = 0.3
        classification_weight = 0.7
        
        # Normalize isolation forest score to 0-1 range
        normalized_iso_score = max(0, min(1, (0.5 - iso_score) * 2))
        
        combined_score = (anomaly_weight * normalized_iso_score + 
                         classification_weight * rf_fraud_prob)
        
        # Determine risk level
        if combined_score >= 0.8:
            risk_level = "CRITICAL"
        elif combined_score >= 0.6:
            risk_level = "HIGH"
        elif combined_score >= 0.4:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"
        
        return {
            'fraud_probability': float(combined_score),
            'risk_level': risk_level,
            'is_anomaly': iso_anomaly == -1,
            'anomaly_score': float(normalized_iso_score),
            'classification_score': float(rf_fraud_prob),
            'recommendation': self._get_recommendation(combined_score),
            'confidence': float(max(abs(rf_fraud_prob - 0.5) * 2, 0.6))
        }
    
    def _get_recommendation(self, score):
        """Get action recommendation based on fraud score"""
        if score >= 0.8:
            return "BLOCK_TRANSACTION"
        elif score >= 0.6:
            return "REQUIRE_ADDITIONAL_VERIFICATION"
        elif score >= 0.4:
            return "FLAG_FOR_REVIEW"
        else:
            return "APPROVE"
    
    def save_models(self):
        """Save trained models to disk"""
        joblib.dump(self.isolation_forest, 'models/isolation_forest.pkl')
        joblib.dump(self.random_forest, 'models/random_forest.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        logger.info("Models saved successfully")
    
    def load_models(self):
        """Load trained models from disk"""
        try:
            self.isolation_forest = joblib.load('models/isolation_forest.pkl')
            self.random_forest = joblib.load('models/random_forest.pkl')
            self.scaler = joblib.load('models/scaler.pkl')
            self.is_trained = True
            logger.info("Models loaded successfully")
        except FileNotFoundError:
            logger.error("Model files not found. Please train models first.")
            self.train_models()

# Initialize and train the fraud detection engine
if __name__ == "__main__":
    engine = FraudDetectionEngine()
    results = engine.train_models()
    print(f"Training completed: {results}")
    
    # Test with sample transaction
    sample_transaction = {
        'amount': 2500.0,
        'hour_of_day': 2,
        'day_of_week': 6,
        'transaction_frequency': 45,
        'avg_amount_last_30d': 200,
        'location_risk_score': 85,
        'device_trust_score': 25,
        'account_age_days': 15,
        'failed_attempts_last_24h': 3,
        'velocity_score': 95
    }
    
    prediction = engine.predict_fraud(sample_transaction)
    print(f"Fraud prediction: {prediction}")
