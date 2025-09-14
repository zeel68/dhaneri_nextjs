import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react"
import Link from "next/link"

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Returns & Exchanges</span>
        </nav>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <RotateCcw className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-balance">Returns & Exchanges</CardTitle>
              <p className="text-muted-foreground text-pretty">
                We want you to love your purchase! If you're not completely satisfied, we're here to help.
              </p>
            </CardHeader>
          </Card>

          {/* Return Policy Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">30-Day Returns</h3>
                <p className="text-sm text-muted-foreground">
                  Return items within 30 days of delivery for a full refund
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Package className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Original Condition</h3>
                <p className="text-sm text-muted-foreground">Items must be unworn with original tags attached</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-8 w-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Free Returns</h3>
                <p className="text-sm text-muted-foreground">
                  We provide free return shipping labels for your convenience
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Return Process */}
          <Card>
            <CardHeader>
              <CardTitle>How to Return an Item</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Initiate Return</h3>
                    <p className="text-muted-foreground text-sm">
                      Log into your account and go to "My Orders" to start a return request, or contact our customer
                      service team.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Pack Your Item</h3>
                    <p className="text-muted-foreground text-sm">
                      Place the item in its original packaging with all tags attached. Include the return form in the
                      package.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Ship It Back</h3>
                    <p className="text-muted-foreground text-sm">
                      Use the prepaid return label we provide. Drop off at any courier location or schedule a pickup.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Get Your Refund</h3>
                    <p className="text-muted-foreground text-sm">
                      Once we receive and process your return, your refund will be issued to the original payment method
                      within 5-7 business days.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Return Conditions */}
          <Card>
            <CardHeader>
              <CardTitle>Return Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Returnable Items
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Kurtis and tops in original condition</li>
                    <li>• Palazzo sets with tags attached</li>
                    <li>• Accessories in original packaging</li>
                    <li>• Items returned within 30 days</li>
                    <li>• Unworn items with hygiene seals intact</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    Non-Returnable Items
                  </h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom or personalized items</li>
                    <li>• Items worn or washed</li>
                    <li>• Items without original tags</li>
                    <li>• Intimate apparel for hygiene reasons</li>
                    <li>• Items damaged by customer</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exchange Policy */}
          <Card>
            <CardHeader>
              <CardTitle>Exchange Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We offer exchanges for size and color within 30 days of delivery. The item must be in original condition
                with tags attached.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Size Exchange</Badge>
                  <span className="text-sm text-muted-foreground">
                    Exchange for a different size of the same item (subject to availability)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">Color Exchange</Badge>
                  <span className="text-sm text-muted-foreground">
                    Exchange for a different color of the same item (subject to availability)
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our customer service team is here to help with your return or exchange.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="outline">
                  <Link href="/profile">View My Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
