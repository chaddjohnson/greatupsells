import Head from 'next/head';
import { useRouter } from 'next/router';
import { Breadcrumbs, Hidden } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { Brush as PopupThemesIcon } from '@material-ui/icons';
import { Loader } from '@greatupsellsreact-components';
import { Layout, Link, PopupThemeEditor } from '../../components';
import { usePopupTheme } from '../../hooks';

const LoadingComponent = () => (
  <>
    <Skeleton animation="wave" height={72} />
    <Skeleton variant="rect" animation="wave" width="100%" height={500} />
  </>
);

const ErrorComponent = () => <p>Unable to load popup theme.</p>;

const EditPopupThemePage = () => {
  const router = useRouter();
  const popupThemeId = router.query.id;

  const {
    popupTheme,
    popupThemeError,
    popupThemeLoading,
    savePopupTheme
  } = usePopupTheme(popupThemeId);

  const handleSubmit = async (values) => {
    await savePopupTheme(values);
  };

  return (
    <>
      <Head>
        <title>Edit Popup Theme</title>
      </Head>
      <Layout
        title={
          <>
            <Hidden xsDown>
              <Breadcrumbs>
                <Link href="/popup-themes">Popup Themes</Link>
                <span>Edit Popup Theme</span>
              </Breadcrumbs>
            </Hidden>
            <Hidden smUp>
              <span>Edit Popup Theme</span>
            </Hidden>
          </>
        }
        icon={<PopupThemesIcon />}
        contentProps={{
          style: {
            height: '100%'
          }
        }}
      >
        <Loader
          isLoading={popupThemeLoading}
          isError={!!popupThemeError}
          loadingComponent={LoadingComponent}
          errorComponent={ErrorComponent}
        >
          <PopupThemeEditor
            initialValues={popupTheme}
            onSubmit={handleSubmit}
          />
        </Loader>
      </Layout>
    </>
  );
};

export default EditPopupThemePage;
