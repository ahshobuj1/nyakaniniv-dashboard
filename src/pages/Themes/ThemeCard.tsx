
import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {ImageIcon, Edit} from 'lucide-react';

interface ThemeCardProps {
  theme: any;
  onEdit: (theme: any) => void;
}

export default function ThemeCard({theme, onEdit}: ThemeCardProps) {
  return (
    <Card className="group/card flex flex-col overflow-hidden h-full">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          {theme.name}
          <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-1 rounded">
            {theme.slug}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 flex-grow">
        <div className="h-[250px] sm:h-[350px] w-full relative rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border">
          {theme.previewImageUrl ? (
            <img
              src={theme.previewImageUrl}
              alt={theme.name}
              className="object-cover object-top w-full h-full transform group-hover/card:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-sm">No Preview</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => onEdit(theme)}
        >
          <Edit className="w-4 h-4" />
          Edit Theme
        </Button>
      </CardFooter>
    </Card>
  );
}
