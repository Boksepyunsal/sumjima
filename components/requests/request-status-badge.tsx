import { Badge } from '@/components/ui/badge';
import { Database } from '@/lib/database.types';

type RequestStatus = Database['public']['Tables']['requests']['Row']['status'];

interface RequestStatusBadgeProps {
  status: RequestStatus;
  offers: number;
}

export function RequestStatusBadge({
  status,
  offers,
}: RequestStatusBadgeProps) {
  switch (status) {
    case 'open':
      if (offers > 0) {
        return (
          <Badge variant="secondary" className="text-xs">
            {offers} Offers
          </Badge>
        );
      }
      return (
        <Badge
          variant="outline"
          className="border-primary/50 text-xs text-primary"
        >
          Waiting
        </Badge>
      );
    case 'matched':
      return (
        <Badge variant="secondary" className="text-xs">
          Matched
        </Badge>
      );
    case 'closed':
      return (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          마감
        </Badge>
      );
    default:
      return null;
  }
}

export function getCategoryIcon(category: string) {
  switch (category) {
    case '이사/용달':
      return '📦';
    case '청소':
      return '🧹';
    case '철거':
      return '🔨';
    default:
      return '📋';
  }
}
