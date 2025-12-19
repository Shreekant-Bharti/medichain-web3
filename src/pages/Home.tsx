import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  Globe,
  Users,
  Activity,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Decentralized Healthcare
              <span className="block text-primary mt-2">On the Blockchain</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              MediChain revolutionizes healthcare data management with secure,
              transparent, and patient-controlled medical records powered by
              blockchain technology.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link to="/patient">
                <Button size="lg" className="gap-2">
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/doctor">
                <Button size="lg" variant="outline">
                  For Healthcare Providers
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose MediChain?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the future of healthcare with our blockchain-powered
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your medical records are encrypted end-to-end and stored on
                  IPFS. Only you control access to your data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Instant Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Healthcare providers can access your records instantly with
                  your permission, improving care quality and emergency
                  response.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lock className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Blockchain Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Immutable audit trails on Ethereum blockchain ensure data
                  integrity and prevent unauthorized modifications.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Global Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access your medical records from anywhere in the world.
                  Perfect for travelers and international patients.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Patient-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You own your health data. Grant and revoke access to doctors
                  and hospitals at any time with full transparency.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Activity className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Smart Prescriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Digital prescriptions with built-in fraud prevention.
                  Pharmacies verify authenticity instantly on the blockchain.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-muted-foreground">Decentralized</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                256-bit
              </div>
              <div className="text-muted-foreground">Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">∞</div>
              <div className="text-muted-foreground">Storage</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Health Data?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Join MediChain today and experience the future of healthcare data
            management
          </p>
          <Link to="/patient">
            <Button size="lg" variant="secondary" className="gap-2">
              Register as Patient
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer CTA for Providers */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Healthcare Provider?
              </h3>
              <p className="text-muted-foreground">
                Join our network of verified doctors and pharmacies
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/doctor">
                <Button variant="outline">Doctor Portal</Button>
              </Link>
              <Link to="/pharmacy">
                <Button variant="outline">Pharmacy Portal</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
