"use-client";

interface HeadingProps {
  title: string;
  subtitle?: string;
  description?: string;
  titleColor?: string;
  descriptionColor?: string;
}

export default function Heading({ title, subtitle, description, titleColor, descriptionColor }: HeadingProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      {subtitle && <div className="bg-primary/10 text-primary inline-block rounded-lg px-3 py-1 text-sm">{subtitle}</div>}
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={titleColor ? { color: titleColor } : undefined}>
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground" style={descriptionColor ? { color: descriptionColor } : undefined}>
          {description}
        </p>
      )}
    </div>
  );
}
