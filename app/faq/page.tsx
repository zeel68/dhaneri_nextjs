import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function FAQPage() {
  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all items in original condition with tags attached. Custom or altered items cannot be returned.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 5-7 business days, while express shipping takes 2-3 business days. Processing time is 1-2 business days.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only ship within India. We are working on expanding our shipping to international locations soon.",
    },
    {
      question: "How do I determine my size?",
      answer:
        "Please refer to our detailed size guide available on each product page. If you're between sizes, we recommend sizing up for a comfortable fit.",
    },
    {
      question: "Are your products authentic Indian wear?",
      answer:
        "Yes, all our products are designed with authentic Indian craftsmanship and traditional techniques, while incorporating modern styling.",
    },
    {
      question: "Do you offer custom tailoring?",
      answer:
        "We offer basic alterations for certain items. Please contact our customer service team for specific requirements and pricing.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, UPI, net banking, and cash on delivery for eligible orders.",
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email and SMS. You can also track your order in the 'My Orders' section of your account.",
    },
    {
      question: "Do you have a physical store?",
      answer:
        "Yes, we have a flagship store in Mumbai. You can visit us to see our collection in person and get styling advice from our team.",
    },
    {
      question: "How do I care for my garments?",
      answer:
        "Care instructions are provided with each garment. Generally, we recommend dry cleaning for embellished items and gentle hand wash for cotton pieces.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h1>

          <p className="text-lg text-muted-foreground text-center mb-12">
            Find answers to common questions about our products, shipping, and policies.
          </p>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Still have questions? We're here to help!</p>
            <Button asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
