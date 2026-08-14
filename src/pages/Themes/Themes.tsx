import  {useState} from 'react';
import {useGetAllThemesQuery} from '@/features/themes/themeApi';
import ThemeCard from './ThemeCard';
import EditThemeModal from './EditThemeModal';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Themes() {
  const {data, isLoading, isError} = useGetAllThemesQuery({});
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (theme: any) => {
    setSelectedTheme(theme);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTheme(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-destructive">
        Failed to load themes.
      </div>
    );
  }

  const themes = data?.data || [];

  return (
    <div className="p-4 max-w-7xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Themes</h1>
        <p className="text-muted-foreground mt-2">
          Manage all available portfolio themes for your DJs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 justify-between">
        {themes.map((theme: any) => (
          <ThemeCard key={theme.id} theme={theme} onEdit={handleEdit} />
        ))}
      </div>

      {themes.length === 0 && (
        <div className="text-center p-12 border rounded-md bg-muted/20">
          <p className="text-muted-foreground">No themes found.</p>
        </div>
      )}

      <EditThemeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        theme={selectedTheme}
      />
    </div>
  );
}
