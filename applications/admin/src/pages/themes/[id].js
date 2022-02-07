import Head from 'next/head';
import { useRouter } from 'next/router';
import { Breadcrumbs, Hidden } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Brush as ThemesIcon } from '@material-ui/icons';
import { Loader } from '@greatupsells/react-components';
import { Layout, Link, ThemeEditor } from '../../components';
import { useTheme } from '../../hooks';

const LoadingComponent = () => (
  <>
    <Skeleton animation="wave" height={72} />
    <Skeleton variant="rect" animation="wave" width="100%" height={500} />
  </>
);

const ErrorComponent = () => <p>Unable to load theme.</p>;

const EditThemePage = () => {
  const router = useRouter();
  const themeId = router.query.id;

  const { theme, themeError, themeLoaded, saveTheme } = useTheme(themeId);

  const handleSubmit = async (values) => {
    await saveTheme(values);
  };

  return (
    <>
      <Head>
        <title>Edit Theme</title>
      </Head>
      <Layout
        title={
          <>
            <Hidden xsDown>
              <Breadcrumbs>
                <Link href="/themes">Themes</Link>
                <span>Edit Theme</span>
              </Breadcrumbs>
            </Hidden>
            <Hidden smUp>
              <span>Edit Theme</span>
            </Hidden>
          </>
        }
        icon={<ThemesIcon />}
        contentProps={{
          style: {
            height: '100%'
          }
        }}
      >
        <Loader
          isLoading={!themeLoaded}
          isError={!!themeError}
          loadingComponent={LoadingComponent}
          errorComponent={ErrorComponent}
        >
          <ThemeEditor initialValues={theme} onSubmit={handleSubmit} />
        </Loader>
      </Layout>
    </>
  );
};

export default EditThemePage;
