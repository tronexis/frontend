import React, { useEffect } from "react";
import { ParticipantCard } from "./ParticipantCard";
import offerLeftLinear from "src/assets/offer-linear.webp";
import rightLinear from "src/assets/right-linear-bg.webp";
import { Button, DividerTitle } from "src/views/components";
import { useMaintainers } from "../../../../hooks";
import { ProjectId } from "src/api/model";

interface MaintainersProps {
  projectId: ProjectId;
  viewAllButton?: boolean;
}

export function Maintainers(props: MaintainersProps) {
  const { maintainersRes, isLoading, error, reloadMaintainers } = useMaintainers(props.projectId);

  useEffect(() => {
    reloadMaintainers();
  }, []);

  if (maintainersRes === null || maintainersRes.maintainers?.length === 0) {
    return null;
  } else {
    return (
      <section className="relative">
        <img
          src={rightLinear}
          alt="right linear Background"
          className="absolute pointer-events-none object-cover right-0 max-w-[671px] opacity-80 z-0-top-[15%]"
        />
        {/* <img
          src={faq}
          alt="linear Background"
          className="absolute pointer-events-none object-cover -translate-x-1/2 left-1/2 w-full max-h-[850px] z-0 max-w-[780px] h-full bottom-0"
        /> */}
        <img
          src={offerLeftLinear}
          alt="Linear background"
          className="absolute max-w-[670px] w-full z-0 pointer-events-none left-[-10%] opacity-70 -top-[15%] xl:-top-[26%] "
        />

        <DividerTitle title="Who are We?" />

        <div className="xl:max-w-[98%] 1400:max-w-[90%] 1500:max-w-[84%] 3xl:!max-w-[1560px] !px-4 xl:!px-0  mx-auto text-center">
          {/* Participants List */}
          <div className="flex justify-center flex-wrap gap-14 sm:gap-8">
            {maintainersRes.maintainers?.map((maintainer, index) => <ParticipantCard maintainer={maintainer} key={index} />)}
          </div>

          {/* View All Button */}
          {props.viewAllButton && (
            <div className="relative flex justify-center items-center !mt-7 xl:!mt-14 2xl:!mt-16 3xl:!mt-20">
              <Button audience="ALL" className="cursor-pointer" level="SECONDARY" size="LARGE" asChild>
                <span> View All</span>
              </Button>
            </div>
          )}
        </div>
        {/*TODO: error*/}
        {error && <div>{error.message}</div>}
      </section>
    );
  }
}
