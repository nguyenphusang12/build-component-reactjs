import React, { useEffect, useRef } from "react";
import style from "./SlideFade.module.scss";
const SlideFade = ({ children }) => {
  const listRef = useRef(null);
  useEffect(() => {
    if (listRef.current) {
      let firstPageX;
      let positionEnd;
      let positionCur;
      const elementRoot = listRef.current;
      const litsItem = document.querySelectorAll(".item");
      const elementHref = document.getElementsByTagName("a");
      const totalWidth = Array.from(litsItem).reduce((pre, cur) => {
        return cur.clientWidth + pre;
      }, 0);
      if (totalWidth) {
        elementRoot.style.width = `${totalWidth}px`;
      }
      console.log(elementRoot.parentNode.getBoundingClientRect());

      const handleEventMove = (e) => {
        if (e.pageX != firstPageX) {
          elementRoot.style.cursor = "grabbing";
          console.log("run: ", e.pageX);
          if (positionEnd) {
            console.log("positionEnd: ", positionEnd);
            positionCur = e.pageX - firstPageX + positionEnd;
            elementRoot.style.transform = `translateX(${positionCur}px)`;
          } else {
            positionCur = e.pageX - firstPageX;
            elementRoot.style.transform = `translateX(${positionCur}px)`;
          }

          if (elementHref) {
            Array.from(elementHref).forEach((item) => {
              item.style.pointerEvents = "none";
              item.style.cursor = "default";
            });
          }
        }
      };
      const handleEVent = (e) => {
        firstPageX = e.pageX;
        elementRoot.addEventListener("mousemove", handleEventMove);
      };
      elementRoot.addEventListener("mousedown", handleEVent);
      const handleRemoveEvent = () => {
        elementRoot.removeEventListener("mousemove", handleEventMove);
        elementRoot.style.cursor = "unset";
        const result =
          elementRoot.parentNode.getBoundingClientRect().width -
          elementRoot.getBoundingClientRect().width;
        if (positionCur < result) {
          elementRoot.style.transform = `translateX(${result}px)`;
          positionEnd = result;
        } else if (positionCur > 0) {
          elementRoot.style.transform = `translateX(0px)`;
          positionEnd = 0;
        } else {
          positionEnd = positionCur;
        }
        if (elementHref) {
          Array.from(elementHref).forEach((item) => {
            item.style.pointerEvents = "auto";
            item.style.cursor = "pointer";
          });
        }
      };
      elementRoot.onmouseup = (event) => handleRemoveEvent(event);
      elementRoot.onmouseleave = (event) => handleRemoveEvent(event);
    }
  }, [listRef.current]);
  return (
    <div className={style.WrapList}>
      <div className={style.list} ref={listRef}>
        {children}
      </div>
    </div>
  );
};

export default SlideFade;
