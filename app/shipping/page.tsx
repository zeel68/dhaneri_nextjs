export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shipping Information</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Standard Delivery</h2>
              <p className="text-muted-foreground mb-2">5-7 business days</p>
              <p className="text-2xl font-bold text-primary">₹99</p>
              <p className="text-sm text-muted-foreground mt-2">Free on orders above ₹1,999</p>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <h2 className="text-xl font-semibold mb-4">Express Delivery</h2>
              <p className="text-muted-foreground mb-2">2-3 business days</p>
              <p className="text-2xl font-bold text-primary">₹199</p>
              <p className="text-sm text-muted-foreground mt-2">Available in major cities</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Shipping Locations</h2>
              <p className="mb-4">
                We currently ship across India to all major cities and towns. International shipping is not available at
                this time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Order Processing</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Orders are processed within 1-2 business days</li>
                <li>You will receive a confirmation email with tracking details</li>
                <li>Custom or made-to-order items may take 7-10 additional days</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Delivery Guidelines</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Someone must be available to receive the package</li>
                <li>ID verification may be required for high-value orders</li>
                <li>Delivery attempts will be made 2-3 times</li>
                <li>Packages will be returned to us if undelivered after 7 days</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
