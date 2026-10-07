import type { ButtonHTMLAttributes, ReactNode } from "react";

/** The small set of building blocks every mini-app uses, so buttons, cards and badges look the same everywhere. */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "danger" };

const BUTTON: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary: "bg-accent-fill text-white hover:bg-accent-deep",
    secondary: "border border-line bg-surface text-ink hover:border-ink-soft",
    danger: "bg-warn text-white hover:opacity-90",
};

export function Button({ variant = "primary", className = "", type = "button", ...rest }: ButtonProps) {
    return (
        <button
            type={type}
            className={`inline-flex h-10 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 text-[14.5px] font-bold disabled:opacity-60 ${BUTTON[variant]} ${className}`}
            {...rest}
        />
    );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <section className={`rounded-2xl border border-line bg-surface p-4 sm:p-5 ${className}`}>{children}</section>
    );
}

const BADGE = {
    neutral: "bg-sunken text-muted",
    accent: "bg-accent-wash text-accent",
    money: "bg-money-wash text-money-ink",
    warn: "bg-warn-wash text-warn",
} as const;

export function Badge({ tone = "neutral", children }: { tone?: keyof typeof BADGE; children: ReactNode }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[12.5px] font-bold ${BADGE[tone]}`}>
            {children}
        </span>
    );
}

const NOTICE = {
    info: "border-accent bg-accent-wash text-ink",
    warn: "border-warn bg-warn-wash text-warn",
} as const;

export function Notice({ tone = "info", children }: { tone?: keyof typeof NOTICE; children: ReactNode }) {
    return (
        <div
            role={tone === "warn" ? "alert" : "note"}
            className={`rounded-xl border p-3.5 text-[14.5px] ${NOTICE[tone]}`}
        >
            {children}
        </div>
    );
}
