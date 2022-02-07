import Head from 'next/head';
import { useRouter } from 'next/router';
import { Skeleton } from '@material-ui/lab';
import { Brush as ThemesIcon } from '@material-ui/icons';
import { Loader } from '@greatupsells/react-components';
import { Layout, ThemeList } from '../../components';
import { useThemes, useTheme } from '../../hooks';

const LoadingComponent = () => (
  <>
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
    <Skeleton animation="wave" height={75} />
  </>
);

const ErrorComponent = () => <p>Unable to load themes.</p>;

const ThemesPage = () => {
  const router = useRouter();

  const { themes, themesLoaded, themesError } = useThemes();
  const { cloneTheme } = useTheme();

  const handleCloneTheme = async (theme) => {
    const clonedTheme = await cloneTheme(theme);
    router.push(`/themes/${clonedTheme._id}`);
  };

  return (
    <>
      <Head>
        <title>Themes</title>
      </Head>
      <Layout title="Themes" icon={<ThemesIcon />}>
        <Loader
          isLoading={!themesLoaded}
          isError={!!themesError}
          loadingComponent={LoadingComponent}
          errorComponent={ErrorComponent}
        >
          <ThemeList themes={themes} onCloneTheme={handleCloneTheme} />
        </Loader>
      </Layout>
    </>
  );
};

export default ThemesPage;
