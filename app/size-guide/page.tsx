import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ruler, Info } from "lucide-react"
import Link from "next/link"

export default function SizeGuidePage() {
  const kurtiSizes = [
    { size: "XS", bust: "32", waist: "26", hip: "34", length: "40", shoulder: "13.5" },
    { size: "S", bust: "34", waist: "28", hip: "36", length: "41", shoulder: "14" },
    { size: "M", bust: "36", waist: "30", hip: "38", length: "42", shoulder: "14.5" },
    { size: "L", bust: "38", waist: "32", hip: "40", length: "43", shoulder: "15" },
    { size: "XL", bust: "40", waist: "34", hip: "42", length: "44", shoulder: "15.5" },
    { size: "XXL", bust: "42", waist: "36", hip: "44", length: "45", shoulder: "16" },
  ]

  const palazzoSizes = [
    { size: "XS", waist: "26", hip: "34", length: "37", inseam: "26" },
    { size: "S", waist: "28", hip: "36", length: "37", inseam: "26" },
    { size: "M", waist: "30", hip: "38", length: "37", inseam: "26" },
    { size: "L", waist: "32", hip: "40", length: "37", inseam: "26" },
    { size: "XL", waist: "34", hip: "42", length: "37", inseam: "26" },
    { size: "XXL", waist: "36", hip: "44", length: "37", inseam: "26" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Size Guide</span>
        </nav>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Ruler className="h-12 w-12 text-secondary" />
              </div>
              <CardTitle className="text-2xl md:text-3xl text-balance">Size Guide</CardTitle>
              <p className="text-muted-foreground text-pretty">
                Find your perfect fit with our comprehensive size guide. All measurements are in inches.
              </p>
            </CardHeader>
          </Card>

          {/* How to Measure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-secondary" />
                How to Measure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Bust</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure around the fullest part of your bust, keeping the tape parallel to the floor.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Waist</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure around your natural waistline, which is the narrowest part of your torso.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Hip</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure around the fullest part of your hips, approximately 8 inches below your waist.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Length</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure from the highest point of your shoulder down to where you want the garment to end.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-2">Shoulder</h3>
                    <p className="text-sm text-muted-foreground">
                      Measure from one shoulder point to the other across your back.
                    </p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Tip:</strong> For the most accurate measurements, have someone help you measure while
                      wearing well-fitting undergarments.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Size Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Size Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="kurtis" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="kurtis">Kurtis & Tops</TabsTrigger>
                  <TabsTrigger value="bottoms">Palazzo & Bottoms</TabsTrigger>
                </TabsList>

                <TabsContent value="kurtis" className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Size</th>
                          <th className="text-left p-3 font-medium">Bust (inches)</th>
                          <th className="text-left p-3 font-medium">Waist (inches)</th>
                          <th className="text-left p-3 font-medium">Hip (inches)</th>
                          <th className="text-left p-3 font-medium">Length (inches)</th>
                          <th className="text-left p-3 font-medium">Shoulder (inches)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {kurtiSizes.map((size, index) => (
                          <tr key={size.size} className={`border-b ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
                            <td className="p-3">
                              <Badge variant="outline">{size.size}</Badge>
                            </td>
                            <td className="p-3">{size.bust}</td>
                            <td className="p-3">{size.waist}</td>
                            <td className="p-3">{size.hip}</td>
                            <td className="p-3">{size.length}</td>
                            <td className="p-3">{size.shoulder}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>

                <TabsContent value="bottoms" className="mt-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium">Size</th>
                          <th className="text-left p-3 font-medium">Waist (inches)</th>
                          <th className="text-left p-3 font-medium">Hip (inches)</th>
                          <th className="text-left p-3 font-medium">Length (inches)</th>
                          <th className="text-left p-3 font-medium">Inseam (inches)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {palazzoSizes.map((size, index) => (
                          <tr key={size.size} className={`border-b ${index % 2 === 0 ? "bg-muted/20" : ""}`}>
                            <td className="p-3">
                              <Badge variant="outline">{size.size}</Badge>
                            </td>
                            <td className="p-3">{size.waist}</td>
                            <td className="p-3">{size.hip}</td>
                            <td className="p-3">{size.length}</td>
                            <td className="p-3">{size.inseam}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Fit Guide */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Fit Guide</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w\ */}
        </div>
      </div>
    </div>
  )
};
