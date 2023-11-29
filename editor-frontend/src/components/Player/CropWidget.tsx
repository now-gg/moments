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
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    top: `${top}px`,
    left: `${left}px`,
    aspectRatio: aspectRatio,
  } : {
    top: `${top}px`,
    left: `${left}px`,
    aspectRatio: aspectRatio,
  };


  return (
      <div className={`draggable absolute h-full border-2 border-gray-400 border-opacity-50 shadow-md`} ref={setNodeRef} style={style} {...listeners} {...attributes}>
    
       {/* <div className="grid grid-cols-3 grid-rows-3 h-full w-full">
        <div className="col-start-1 row-start-1 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-2 row-start-1 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-3 row-start-1 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-1 row-start-2 border-2 border-gray-200 opacity-10"></div>   
        <div className="col-start-2 row-start-2 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-3 row-start-2 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-1 row-start-3 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-2 row-start-3 border-2 border-gray-200 opacity-10"></div>
        <div className="col-start-3 row-start-3 border-2 border-gray-200 opacity-10"></div>
      </div> */}
      </div>
  )
}

export default CropWidget