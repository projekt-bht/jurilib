export function LoadingIndicator() {
  return (
    <div className="text-black bg-white min-h-screen flex flex-col items-center justify-center ">
      <div className="flex flex-col items-center justify-center">
        <div className="w-15 h-15 mb-5 border-5 border-gray-300 border-t-black rounded-full animate-spin"></div>

        <p className="text-lg">
          Warten Sie, während wir eine passende Organisation finden
        </p>
        <p className="text-black mt-2">Dies dauert nur einen Moment...</p>
      </div>
    </div>
  )
}
