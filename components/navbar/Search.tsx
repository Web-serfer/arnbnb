'use client';

import { BiSearch } from 'react-icons/bi';

export const Search = () => {
  return (
    <div className="w-full cursor-pointer rounded-full border-[1px] py-2 shadow-sm transition hover:shadow-md md:w-auto">
      <div className="flex flex-row items-center justify-between">
        {/* Anywhere */}
        <div className="px-6 text-sm font-semibold">Anywhere</div>
        {/* Any Weeek */}
        <div className="hidden flex-1 border-x-[1px] px-6 text-center text-sm font-semibold sm:block">
          Any Weeek
        </div>
        {/* Add Guest and Search Icon */}
        <div className="flex flex-row items-center gap-3 pl-6 pr-6 text-sm text-gray-600">
          <div className="hidden sm:block">Add Guest</div>
          <div className="rounded-full bg-rose-500 p-2 text-white">
            <BiSearch size={12} />
          </div>
        </div>
      </div>
    </div>
  );
};
