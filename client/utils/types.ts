// Header navigation-i type-ery
// NavLink — [href, label] format
// NavChild — nuynyus [href, label] ev mtnenq dropdown-i hamar
export type NavLink = string[];
export type NavChild = string[];

// HeaderLink-y kkam simple link e (array) kkam link + children dropdown
export type HeaderLink =
  | NavLink
  | {
      link: NavLink;
      children: NavChild[];
    };
