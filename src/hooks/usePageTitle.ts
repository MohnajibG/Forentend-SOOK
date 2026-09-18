import { useEffect } from "react";

/** Met à jour le titre de l'onglet du navigateur pour la page courante. */
const usePageTitle = (title: string) => {
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · SOOK`;
    return () => {
      document.title = previous;
    };
  }, [title]);
};

export default usePageTitle;
