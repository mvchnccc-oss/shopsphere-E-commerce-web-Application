import React from "react";

export default function Loading() {
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">

                <style>{`@keyframes spinner {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}.animate-spinner {animation: spinner 1s linear infinite;`}</style>


                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spinner"></div>
                    <p className="text-sm font-light text-gray-500 tracking-[0.2em] uppercase">Loading</p>
                </div>
            </div>
        </>
    );
}