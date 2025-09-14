export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">About Us</h1>

          <div className="mb-12">
            <img
              src="/placeholder.svg?height=400&width=800"
              alt="Our story"
              className="w-full h-64 object-cover rounded-lg mb-8"
            />

            <div className="prose prose-slate max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Founded with a passion for celebrating Indian heritage through contemporary fashion, we bring you the
                finest collection of traditional and modern women's clothing.
              </p>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="mb-4">
                  What started as a small family business has grown into a trusted destination for women seeking
                  authentic Indian clothing with a modern twist. We believe that traditional wear should be both
                  beautiful and comfortable, suitable for today's confident woman.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="mb-4">
                  To preserve and promote Indian textile traditions while creating contemporary designs that empower
                  women to express their unique style. We are committed to sustainable practices and supporting local
                  artisans.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Quality Promise</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Premium fabrics sourced from trusted suppliers</li>
                  <li>Skilled craftsmanship with attention to detail</li>
                  <li>Rigorous quality control at every step</li>
                  <li>Sustainable and ethical manufacturing practices</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Authenticity</h3>
                    <p className="text-sm text-muted-foreground">Staying true to traditional Indian craftsmanship</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Innovation</h3>
                    <p className="text-sm text-muted-foreground">Blending tradition with contemporary design</p>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">Sustainability</h3>
                    <p className="text-sm text-muted-foreground">Responsible fashion for a better future</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
