import type { LucideProps } from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

/**
 * Type definition for metrics/statistics displayed in the StatsCard component.
 * Used in the user dashboard to represent key user statistics.
 * @property id - Unique identifier for the statistic
 * @property title - Name of the statistic
 * @property statValue - Value of the statistic
 * @property iconColor - Specifies the color theme for the icon background and icon itself
 * @property Icon - Lucide icon component to be displayed
 */
export type Stats = {
  id: string;
  title: string;
  statValue: number;
  iconColor: string;
  Icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
};
