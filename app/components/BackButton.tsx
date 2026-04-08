import Link from 'next/link';

interface BackButtonProps {
    href?: string;
    label?: string;
}

export default function BackButton({ href = '/', label = 'Kembali' }: BackButtonProps) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200"
        >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 group-hover:bg-blue-50 transition-all duration-200">
                <span className="text-lg leading-none group-hover:-translate-x-0.5 transition-transform duration-200">←</span>
            </span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}