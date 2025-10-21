import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/signup-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium" style={{ color: '#FF5F1F' }}>
            <div className="flex items-center justify-center">
              <Image src="/image.png" alt="Logo" width={30} height={30} className="h-9 w-auto" />
            </div>
            <span className="text-lg font-semibold">RedSent AI</span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block" style={{ backgroundColor: '#FFF5F0' }}>
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-md space-y-6 text-center">
            <h2 className="text-3xl font-bold" style={{ color: '#FF5F1F' }}>
              AI Wrapper Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Seamless integration with advanced LLMs for extracting, analyzing, and summarizing Reddit sentiments with cloud-optimized infrastructure.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-lg border p-4" style={{ borderColor: '#FF5F1F' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#FF5F1F' }}>
                  100%
                </div>
                <div className="text-sm text-gray-600">Sentiment Accuracy</div>
              </div>
              <div className="rounded-lg border p-4" style={{ borderColor: '#FF5F1F' }}>
                <div className="text-2xl font-bold mb-1" style={{ color: '#FF5F1F' }}>
                  24/7
                </div>
                <div className="text-sm text-gray-600">Real-time Tracking</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </div>
    </div>
  )
}