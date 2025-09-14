import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Terms & Conditions</span>
        </nav>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl text-balance">Terms & Conditions</CardTitle>
              <p className="text-muted-foreground">Last updated: January 2024</p>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Dhaneri's website and services, you accept and agree to be bound by the terms
                    and provision of this agreement. If you do not agree to abide by the above, please do not use this
                    service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">2. Use License</h2>
                  <p className="text-muted-foreground leading-relaxed mb-3">
                    Permission is granted to temporarily download one copy of the materials on Dhaneri's website for
                    personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of
                    title, and under this license you may not:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
                    <li>modify or copy the materials</li>
                    <li>use the materials for any commercial purpose or for any public display</li>
                    <li>attempt to reverse engineer any software contained on the website</li>
                    <li>remove any copyright or other proprietary notations from the materials</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">3. Product Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We strive to provide accurate product information, including descriptions, prices, and availability.
                    However, we do not warrant that product descriptions or other content is accurate, complete,
                    reliable, current, or error-free. Colors shown in product images may vary due to monitor settings
                    and lighting conditions.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">4. Pricing and Payment</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve
                    the right to modify prices at any time. Payment must be received in full before products are
                    shipped. We accept various payment methods including credit cards, debit cards, and digital wallets.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">5. Shipping and Delivery</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We ship to addresses within India. Shipping costs and delivery times vary based on location and
                    shipping method selected. Free shipping is available on orders above ₹999. Delivery times are
                    estimates and not guaranteed. Risk of loss and title for products pass to you upon delivery to the
                    carrier.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">6. Returns and Exchanges</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We offer a 30-day return policy for most items. Products must be returned in original condition with
                    tags attached. Custom or personalized items cannot be returned unless defective. Return shipping
                    costs are the responsibility of the customer unless the return is due to our error.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">7. Privacy Policy</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your
                    information when you use our service. By using our service, you agree to the collection and use of
                    information in accordance with our Privacy Policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    In no event shall Dhaneri or its suppliers be liable for any damages (including, without limitation,
                    damages for loss of data or profit, or due to business interruption) arising out of the use or
                    inability to use the materials on Dhaneri's website, even if Dhaneri or an authorized representative
                    has been notified orally or in writing of the possibility of such damage.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms & Conditions, please contact us at:
                  </p>
                  <div className="mt-3 text-muted-foreground">
                    <p>Email: support@dhaneri.com</p>
                    <p>Phone: +91 98765 43210</p>
                    <p>Address: 123 Fashion Street, Mumbai, Maharashtra 400001</p>
                  </div>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
