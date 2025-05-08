
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const SettingsPage = () => {
  const { t } = useLanguage();

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="page-title">{t('settings')}</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('userManagement')}</CardTitle>
            <CardDescription>
              {t('teamMembers')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('nextVersion')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('systemSettings')}</CardTitle>
            <CardDescription>
              {t('configureApp')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {t('nextVersion')}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
