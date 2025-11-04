import { Spinner } from "@/components/ui/spinner";
export default function Loading() {
    return (
        <div className="flex flex-col justify-between items-center h-screen">
            <div className="flex flex-col justify-center items-center grow gap-6">
                <Spinner className="size-18 text-gray-700" />
                <div className="text-lg pt-5 text-black">
                    Warten Sie, während wir eine passende Organisation finden
                </div>
                <div className="text-base text-gray-500">
                    Dies dauert nur einen Moment...
                </div>
            </div>
            <div className="mb-8 text-gray-400">
                Deine Anfrage wird vertraulich behandelt.
            </div>
        </div>

    );
}
