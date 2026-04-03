import React, { type ReactNode, useEffect } from 'react';
import Layout from '@theme-original/DocItem/Layout';
import type LayoutType from '@theme/DocItem/Layout';
import type { WrapperProps } from '@docusaurus/types';
import { useLocation } from '@docusaurus/router';

type Props = WrapperProps<typeof LayoutType>;

const COOKIE_NAME = 'notes_access';

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(name + '='));
  return match ? match.slice(name.length + 1) : null;
}

export default function LayoutWrapper(props: Props): ReactNode {
  const location = useLocation();
  const isNotesPath = location.pathname.startsWith('/docs/notes');

  useEffect(() => {
    if (!isNotesPath) return;
    const cookie = getCookie(COOKIE_NAME);
    if (cookie !== '1') {
      window.location.replace(`/unlock?redirect=${encodeURIComponent(location.pathname)}`);
    }
  }, [isNotesPath, location.pathname]);

  // While redirecting, render nothing to avoid flash of content
  if (isNotesPath && typeof document !== 'undefined' && getCookie(COOKIE_NAME) !== '1') {
    return null;
  }

  return <Layout {...props} />;
}
