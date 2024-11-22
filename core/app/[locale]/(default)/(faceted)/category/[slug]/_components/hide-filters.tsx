"use client"; 

import {Filter} from '../../svg/svg'

interface HideFiltersProps {
  setHideFilter: (value: boolean) => void,
  hideFilter: boolean,
}
export default function HideFilters({setHideFilter, hideFilter}: HideFiltersProps) {

  const handleClick = () => {
    setHideFilter(!hideFilter)
  }
  return (
    <div className="pointer flex items-center gap-[8px]" onClick={handleClick}><span>Hide Filters</span> <Filter /></div>
  )
}
