import { Scale } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <Scale className="w-5 h-5" />
              </div>
              <span className="font-semibold text-foreground">JuriLib</span>
            </div>
            <p className="text-muted-foreground text-sm">Connecting people with legal expertise</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  For Individuals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  For Organisations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  For Lawyers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:support@jurimatch.com" className="hover:text-foreground transition">
                  support@jurimatch.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="hover:text-foreground transition">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 JuriLib. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
