import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { FadeIn } from "@/shared/components/animations";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  error: string;
  onRetry?: () => void;
  onClearError?: () => void;
  onGoHome?: () => void;
  variant?: "page" | "card" | "inline";
  showHomeButton?: boolean;
  className?: string;
}

export function ErrorState({
  title = "حدث خطأ",
  error,
  onRetry,
  onClearError,
  onGoHome,
  variant = "page",
  showHomeButton = false,
  className,
}: ErrorStateProps) {
  const containerClasses = {
    page: "min-h-screen bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center",
    card: "p-6",
    inline: "py-8 px-4",
  };

  const cardClasses = {
    page: "max-w-md mx-auto",
    card: "w-full",
    inline: "w-full max-w-md mx-auto",
  };

  return (
    <div className={cn(containerClasses[variant], className)}>
      <FadeIn>
        <Card className={cardClasses[variant]}>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-destructive/10 dark:bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-destructive dark:text-red-400">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {error}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {onClearError && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearError}
                  className="flex-1 sm:flex-none"
                >
                  تجاهل
                </Button>
              )}

              {onRetry && (
                <Button
                  size="sm"
                  onClick={onRetry}
                  className="flex-1 sm:flex-none bg-design-main hover:bg-design-main-dark"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  إعادة المحاولة
                </Button>
              )}

              {showHomeButton && onGoHome && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGoHome}
                  className="flex-1 sm:flex-none"
                >
                  <Home className="h-4 w-4 mr-2" />
                  الرئيسية
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

// Specialized error states for common use cases
export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      title="مشكلة في الاتصال"
      error="تعذر الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى."
      onRetry={onRetry}
      variant="card"
    />
  );
}

export function NotFoundError({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <ErrorState
      title="الصفحة غير موجودة"
      error="عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها."
      onGoHome={onGoHome}
      showHomeButton={true}
      variant="page"
    />
  );
}

export function UnauthorizedError({ onGoHome }: { onGoHome?: () => void }) {
  return (
    <ErrorState
      title="غير مخول"
      error="ليس لديك صلاحية للوصول إلى هذه الصفحة. يرجى تسجيل الدخول أو التواصل مع المسؤول."
      onGoHome={onGoHome}
      showHomeButton={true}
      variant="page"
    />
  );
}
