import { Shield, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900/50 border-t border-slate-700 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">Invisible Shield</span>
            </div>
            <p className="text-slate-400">Trust-driven transaction security for the future of retail.</p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Product</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">AI Fraud Detection</li>
              <li className="hover:text-white cursor-pointer transition-colors">Blockchain Trust</li>
              <li className="hover:text-white cursor-pointer transition-colors">Real-time Monitoring</li>
              <li className="hover:text-white cursor-pointer transition-colors">Enterprise API</li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Solutions</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">Retail Security</li>
              <li className="hover:text-white cursor-pointer transition-colors">E-commerce Protection</li>
              <li className="hover:text-white cursor-pointer transition-colors">Payment Fraud Prevention</li>
              <li className="hover:text-white cursor-pointer transition-colors">Customer Trust Building</li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Company</h3>
            <ul className="space-y-2 text-slate-400">
              <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Careers</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400">© 2024 Invisible Shield. Built for Walmart Cybersecurity Hackathon.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-slate-400">Powered by</span>
            <div className="flex items-center space-x-2">
              <span className="text-blue-400 font-medium">AI</span>
              <span className="text-slate-400">+</span>
              <span className="text-purple-400 font-medium">Blockchain</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
