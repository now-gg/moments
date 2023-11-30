import { useDraggable } from '@dnd-kit/core'

type CropWidgetProps = {
  left: number;
  top: number;
  aspectRatio: string;
}

const CropWidget = ({left, top, aspectRatio}: CropWidgetProps) => {

  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const baseStyles = {
    top: `${top}px`,
    left: `${left}px`,
    aspectRatio: aspectRatio,
    background: `url("https://cms-cdn.now.gg/cms-media/2023/10/${aspectRatio.replace('/', '')}-grid-lines.png") 0% 0% / cover no-repeat, center center rgba(255, 255, 255, 0.05)`
  }

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    ...baseStyles
    } : baseStyles;


  return (
      <div className={`draggable absolute h-full box-content`} ref={setNodeRef} style={style} {...listeners} {...attributes}>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-1 absolute top-0 left-0">
            <path d="M40 2H4C2.89543 2 2 2.90281 2 4.00738C2 19.497 2 23.5073 2 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="4" viewBox="0 0 42 4" fill="none" className="svg-2 absolute top-0" style={{left: 'calc(50% - 21px)'}}>
            <path d="M40 2H2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="4" viewBox="0 0 42 4" fill="none" className="svg-3 absolute bottom-0" style={{left: 'calc(50% - 21px)'}}>
            <path d="M40 2H2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-4 absolute right-0 top-0">
            <path d="M40 40L40 4C40 2.89543 39.0972 2 37.9926 2C22.503 2 18.4927 2 2 2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-5 absolute left-0 bottom-0">
            <path d="M2 2L2 38C2 39.1046 2.90281 40 4.00738 40C19.497 40 23.5073 40 40 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="42" viewBox="0 0 4 42" fill="none" className="svg-6 absolute left-0" style={{top: 'calc(50% - 21px)'}}>
            <path d="M2 2L2 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="4" height="42" viewBox="0 0 4 42" fill="none" className="svg-7 absolute right-0" style={{top: 'calc(50% - 21px)'}}>
            <path d="M2 2L2 40" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none" className="svg-8 absolute bottom-0 right-0">
            <path d="M2 40L38 40C39.1046 40 40 39.0972 40 37.9926C40 22.503 40 18.4927 40 2" stroke="#FF42A5" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
      </div>
  )
}

export default CropWidget