import { SVG } from "@svgdotjs/svg.js";
import React, { useEffect, useRef, useState } from 'react';
import {data} from "../data/data"


const Tree = () =>{
    const svgRef = useRef(null)
    const [angle,setAngle] = useState(45)
    const handleChange = (e) =>{
        setAngle(e.target.value)
    }
    // console.log(data)

    async function branch(parent, len, angle, data) {
        // console.log(data.name)
        for (const item of data) {
            const strokeWidth = len > 25 ? (len - 25) / 18 : 0.2;
            console.log(strokeWidth,item.name)
            // const lines = parent.line(0, 0, 0, 0).stroke({ width: strokeWidth, color: "red" })
            const startX = 0
            const startY = 0
            const endX = 0
            let endY = 0
            const lines = parent.path(`M${startX},${startY} C${startX + 5 * strokeWidth},${startY - 5 * strokeWidth} ${endX - 5 * strokeWidth},${endY + 5 * strokeWidth} ${endX},${endY}`)
                .fill('none')
                .stroke({ color: 'blue', width: strokeWidth })
        
            await new Promise(resolve => {
                // lines.animate(3000).plot(0,0,0,-len).after(resolve)
                endY = -len
                const initialD = lines.attr('d');
                const finalD = `M${startX},${startY} C${startX + 5 * strokeWidth},${startY - 5 * strokeWidth} ${endX - 5 * strokeWidth},${endY + 5 * strokeWidth} ${endX},${endY}`;
                // lines.animate(1000).attr({ d: finalD });
                lines.animate(1000, '<>', 0).plot(finalD).after(resolve)

            })

            // if (len >= 10) {
                const leftLine = parent.group()
                const rightLine = parent.group()

                leftLine.translate(0, -len)
                rightLine.translate(0, -len)

                leftLine.rotate(-angle)
                rightLine.rotate(angle)

                parent.add(leftLine)
                parent.add(rightLine)

            parent.circle(strokeWidth + 5).center(0, 0 - len)
            setAngle(-angle)
                await Promise.all([
                    console.log(item.children,angle),
                    item.children && branch(leftLine, Math.floor(len * .71), Math.floor(angle * .81),item.children)])
            // }
            // else {
            //     const r = Math.floor(Math.random() * 255);
            //     const g = Math.floor(Math.random() * 255);
            //     const b = Math.floor(Math.random() * 255);
            //     const x = "rgb(" + r + "," + g + "," + b + ")";
            //     parent.circle(strokeWidth + 5).center(0, 0 - len).fill(x)
            //     parent.text(item.name).x(0).y(0 - len - 10).font({ size: 12, anchor: "middle" })
            
            // }
        }

    }

    useEffect(()=>{
        const draw = SVG().addTo(svgRef.current)

        const canvasWidth = window.innerWidth;
        const canvasHeight = window.innerHeight;

        draw.size(canvasWidth,canvasHeight)
        draw.viewbox(0,0,canvasWidth,canvasHeight)

        const mainBranch = draw.group().translate(canvasWidth/2,canvasHeight)
        
        branch(mainBranch,150,angle,[data])
        // return()=>{draw.clear()}

    },[])

    return<>
    <div ref={svgRef}/>
    <input onChange={handleChange}/>
    </>
}


export default Tree