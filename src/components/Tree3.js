import { SVG } from "@svgdotjs/svg.js";
import React, { useEffect, useRef, useState } from 'react';
import {data} from "../data/data"

const Tree = () => {
    const svgRef = useRef(null)
    const [angle, setAngle] = useState(-10)
    const handleChange = (e) => {
        setAngle(e.target.value)
    }

    async function branch(parent, len,angles, data) {
        console.log(data)
        for (let i = 0; i < data.length; i++){
        const strokeWidth = len > 25 ? (len - 25) / 18 : 0.2;
        console.log(strokeWidth)
        const lines = parent.line(0, 0, 0, 0).stroke({ width: strokeWidth, color: "red" })
        
        await new Promise(resolve => {
            lines.animate(3000).plot(0, 0, 0, -len).after(resolve)
        })

        if (data[i]) {
            const leftLine = parent.group()
            leftLine.translate(0, -len)
            leftLine.rotate(angles)
            console.log(angles)
            parent.add(leftLine)
            // parent.circle(strokeWidth+5).center(0,0-len)
            await Promise.all([
                data[i].children && branch(leftLine, len * .75,angles+10, data[i].children),
                // branch(rightLine, len * .65, angles, item.children)
            ])
        }
        else {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            const x = "rgb(" + r + "," + g + "," + b + ")";
            parent.circle(strokeWidth + 5).center(0, 0 - len).fill(x)
            
        }

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