import { createApp } from "vue";
import Comment from "@/components/Comment.vue";
import type { commentTargets } from "@/types";
import axios from "axios";
import "@/styles/tailwind.css";
import "@/styles/dark.css";
import "@/styles/index.css";
import "@halo-dev/components/dist/style.css";
import "@/styles/build.css";

interface SonicCommentParam {
    target: commentTargets;
    targetId: number;
    colorScheme?: "system" | "dark" | "light";
    emoji?: string;
}

function getCurrentScriptDir() {
    let scriptElement = document.currentScript || (function() {
        let scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
    })();
    let scriptUrl = scriptElement.getAttribute("src");
    if (scriptUrl) {
        return scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
    }
    return null
}

const styleUrl = getCurrentScriptDir() + "/sonic-comment.css"

export function init(
    el: string,
    params: SonicCommentParam
) {
    const parent = document.querySelector(el) as HTMLElement;

    if (!parent) {
        console.error("Element not found", el);
    }
    const container = document.createElement("div");
    const root = document.createElement("div");
    const loadingHtml = `
    <div>
    <style>
      .loading-container {
        text-align: center;
      }
    
      .loading-container svg {
        width: 1.25rem; 
        height: 1.25rem; 
        display: inline; 
        margin-right: 0.5rem; 
        animation: spin 1s linear infinite;
      }
    
      .loading-container svg circle {
        opacity: 0.25;
      }
    
      .loading-container svg path {
        opacity: 0.75;
      }
      
      @keyframes spin {
          from {
              transform: rotate(0deg);
          }
          to {
              transform: rotate(360deg);
          }
      }
    </style>
    <div class="loading-container">
      <div role="status">
        <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
    </div>
    `;
    root.innerHTML = loadingHtml;
    const shadowDOM = container.attachShadow?.({ mode: "open" }) || container;
    const styleEl = document.createElement("link");
    styleEl.setAttribute("rel", "stylesheet");
    styleEl.setAttribute("href", styleUrl);
    shadowDOM.appendChild(styleEl);
    shadowDOM.appendChild(root);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && parent.childElementCount === 0) {
                parent.appendChild(container);
            }
        });
    });
    observer.observe(parent as Element);

    let create = function () {
        const app = createApp(Comment, {
            target: params.target,
            targetId: params.targetId,
            colorScheme: params.colorScheme,
            emojiData: async () => {
                const { data } = await axios.get(params.emoji);
                return data;
            },
        });
        app.mount(root);
        root.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 500,
            fill: "forwards",
        });
    }

    styleEl.addEventListener("load", function () {
        create();
    });
}
