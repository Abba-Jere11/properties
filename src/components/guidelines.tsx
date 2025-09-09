import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

const steps = [
  {
    number: 1,
    title: "Get Your Application Package",
    description:
      "Download the application package from our website or collect it from our Maiduguri office. Fill in the required details, selecting your preferred payment plan and other relevant information. Start by obtaining your application package which contains all necessary forms and requirements for the house purchase process.",
  },
  {
    number: 2,
    title: "Submit Your Application",
    description:
      "Submit the completed application package to our Maiduguri office or through our online platform for further official consideration by our team.",
  },
  {
    number: 3,
    title: "House Selection",
    description:
      " Once eligible, our team will prompt you to select a house available in our estate, either physically or using our online layout",
  },
  {
    number: 4,
    title: "Authorization for Payment",
    description:
      "Upon selection, you will be issued an authorization letter from our finance team, which will include a reference number carrying the house number and street with reference number.",
  },
  {
    number: 5,
    title: "Make Payment",
    description:
      "Make the appropriate payment or sign the Musharaka/Murabahah bank instrument to the bank as instructed using the payment reference",
  },
  {
    number: 6,
    title: "Provisional Allocation",
    description:
      "Upon confirmation of payment, you will receive a formal provisional allocation letter and possession of the house.",
  },
  {
    number: 7,
    title: "Full Allocation and Documentation",
    description:
      "Upon completion of full payment, you will receive: Full allocation letter. Deed of assignment. Introduction letter to BOGIS for title perfection (all charges and dues payable to BOGIS are the responsibility of the buyer)",
  },
  {
    number: 8,
    title: "Certificate of Occupancy",
    description:
      "Process and obtain your Certificate of Occupancy with BOGIS with all support from Thinklab Properties",
  },
  {
    number: 9,
    title: "Enjoy Your New Home",
    description: "Congratulations! You can now move into your new home and enjoy your investment",
  },
]

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % steps.length)
  }

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + steps.length) % steps.length)
  }

  const goToStep = (index) => {
    setCurrentStep(index)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-4 text-balance">
            STEP BY STEP GUIDE ON HOW TO PURCHASE A BEAUTIFUL HOME FOR YOU AND YOUR FAMILY
          </h1>
          <p className="text-lg text-muted-foreground mb-6">BAKASSI GRA AND TEACHERS VILLAGE, MAIDUGURI</p>

          {/* Download PDF Button */}
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground ">
            <a href="/House Purchase Application Package (17).pdf" download="ThinkLab Estate Application Form.pdf">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Form
            </a>
          </Button>
        </div>

        {/* Steps Slider Container */}
        <div className="max-w-3xl mx-auto">
          {/* Step Navigation Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentStep 
                    ? 'bg-primary scale-125' 
                    : 'bg-muted hover:bg-muted-foreground/50'
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          {/* Current Step Card */}
          <Card className="border border-border min-h-[300px] relative">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                    {steps[currentStep].number}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-foreground mb-4">
                    {steps[currentStep].title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevStep}
                  className="w-10 h-10 p-0"
                  aria-label="Previous step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextStep}
                  className="w-10 h-10 p-0"
                  aria-label="Next step"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
        </div>

        {/* Footer */}
        {/* <div className="text-center mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">For more information, please contact ThinkLab Estate</p>
        </div> */}
      </div>
    </div>
  )
}