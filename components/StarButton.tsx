"use client";


import {Star} from "lucide-react";
import {useState} from "react";


type StarButtonProps = {
    isImportant: boolean;
    onClick: () => void;
};

export default function StarButton({isImportant, onClick}: StarButtonProps) {
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={`rounded-full p-2 transition-colors duration-200 ${
                isImportant ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
        >
            <Star className="h-5 w-5" />
        </button>
    );
}