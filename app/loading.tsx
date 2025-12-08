export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="relative">
                {/* Pulsing rings */}
                <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-xl opacity-20 animate-ping"></div>
                <div className="absolute inset-0 bg-yellow-400 rounded-xl blur-lg opacity-40 animate-pulse"></div>

                {/* Logo */}
                <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center relative z-10 shadow-lg shadow-yellow-400/30">
                    <span className="font-bold text-2xl text-gray-900">UI</span>
                </div>
            </div>
        </div>
    )
}
