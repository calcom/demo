import { ConstructionIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type Props = {
  title: string;
  blurb: string;
};

export function DemoPlaceholder({ title, blurb }: Props) {
  return (
    <Empty className="border border-dashed rounded-xl">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ConstructionIcon />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{blurb}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
