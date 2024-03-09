(function(F,O){typeof exports=="object"&&typeof module<"u"?O(exports):typeof define=="function"&&define.amd?define(["exports"],O):(F=typeof globalThis<"u"?globalThis:F||self,O(F.UnicornStudio={}))})(this,function(F){"use strict";var fi=Object.defineProperty;var pi=(F,O,p)=>O in F?fi(F,O,{enumerable:!0,configurable:!0,writable:!0,value:p}):F[O]=p;var N=(F,O,p)=>(pi(F,typeof O!="symbol"?O+"":O,p),p);let O=0;function p(){if(!(O>100)){if(O===100)console.warn("Curtains: too many warnings thrown, stop logging.");else{const n=Array.prototype.slice.call(arguments);console.warn.apply(console,n)}O++}}function z(){const n=Array.prototype.slice.call(arguments);console.error.apply(console,n)}function pe(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,n=>{let e=Math.random()*16|0;return(n==="x"?e:e&3|8).toString(16).toUpperCase()})}function W(n){return(n&n-1)===0}function Be(n,e,t){return(1-t)*n+t*e}let We=class{constructor(e){if(this.type="Scene",!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){z(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=e.gl,this.initStacks()}initStacks(){this.stacks={pingPong:[],renderTargets:[],opaque:[],transparent:[],renderPasses:[],scenePasses:[]}}resetPlaneStacks(){this.stacks.pingPong=[],this.stacks.renderTargets=[],this.stacks.opaque=[],this.stacks.transparent=[];for(let e=0;e<this.renderer.planes.length;e++)this.addPlane(this.renderer.planes[e])}resetShaderPassStacks(){this.stacks.scenePasses=[],this.stacks.renderPasses=[];for(let e=0;e<this.renderer.shaderPasses.length;e++)this.renderer.shaderPasses[e].index=e,this.renderer.shaderPasses[e]._isScenePass?this.stacks.scenePasses.push(this.renderer.shaderPasses[e]):this.stacks.renderPasses.push(this.renderer.shaderPasses[e]);this.stacks.scenePasses.length===0&&(this.renderer.state.scenePassIndex=null)}addToRenderTargetsStack(e){const t=this.renderer.planes.filter(s=>s.type!=="PingPongPlane"&&s.target&&s.uuid!==e.uuid);let i=-1;if(e.target._depth){for(let s=t.length-1;s>=0;s--)if(t[s].target.uuid===e.target.uuid){i=s+1;break}}else i=t.findIndex(s=>s.target.uuid===e.target.uuid);i=Math.max(0,i),t.splice(i,0,e),e.target._depth?(t.sort((s,r)=>s.index-r.index),t.sort((s,r)=>r.renderOrder-s.renderOrder)):(t.sort((s,r)=>r.index-s.index),t.sort((s,r)=>s.renderOrder-r.renderOrder)),t.sort((s,r)=>s.target.index-r.target.index),this.stacks.renderTargets=t}addToRegularPlaneStack(e){const t=this.renderer.planes.filter(s=>s.type!=="PingPongPlane"&&!s.target&&s._transparent===e._transparent&&s.uuid!==e.uuid);let i=-1;for(let s=t.length-1;s>=0;s--)if(t[s]._geometry.definition.id===e._geometry.definition.id){i=s+1;break}return i=Math.max(0,i),t.splice(i,0,e),t.sort((s,r)=>s.index-r.index),t}addPlane(e){if(e.type==="PingPongPlane")this.stacks.pingPong.push(e);else if(e.target)this.addToRenderTargetsStack(e);else if(e._transparent){const t=this.addToRegularPlaneStack(e);t.sort((i,s)=>s.relativeTranslation.z-i.relativeTranslation.z),t.sort((i,s)=>s.renderOrder-i.renderOrder),this.stacks.transparent=t}else{const t=this.addToRegularPlaneStack(e);t.sort((i,s)=>s.renderOrder-i.renderOrder),this.stacks.opaque=t}}removePlane(e){e.type==="PingPongPlane"?this.stacks.pingPong=this.stacks.pingPong.filter(t=>t.uuid!==e.uuid):e.target?this.stacks.renderTargets=this.stacks.renderTargets.filter(t=>t.uuid!==e.uuid):e._transparent?this.stacks.transparent=this.stacks.transparent.filter(t=>t.uuid!==e.uuid):this.stacks.opaque=this.stacks.opaque.filter(t=>t.uuid!==e.uuid)}setPlaneRenderOrder(e){if(e.type==="ShaderPass")this.sortShaderPassStack(e._isScenePass?this.stacks.scenePasses:this.stacks.renderPasses);else if(e.type==="PingPongPlane")return;if(e.target)e.target._depth?(this.stacks.renderTargets.sort((t,i)=>t.index-i.index),this.stacks.renderTargets.sort((t,i)=>i.renderOrder-t.renderOrder)):(this.stacks.renderTargets.sort((t,i)=>i.index-t.index),this.stacks.renderTargets.sort((t,i)=>t.renderOrder-i.renderOrder)),this.stacks.renderTargets.sort((t,i)=>t.target.index-i.target.index);else{const t=e._transparent?this.stacks.transparent:this.stacks.opaque,i=this.stacks.scenePasses.find((s,r)=>s._isScenePass&&!s._depth&&r===0);!this.renderer.depth||i?(t.sort((s,r)=>r.index-s.index),e._transparent&&t.sort((s,r)=>s.relativeTranslation.z-r.relativeTranslation.z),t.sort((s,r)=>s.renderOrder-r.renderOrder)):(t.sort((s,r)=>s.index-r.index),e._transparent&&t.sort((s,r)=>r.relativeTranslation.z-s.relativeTranslation.z),t.sort((s,r)=>r.renderOrder-s.renderOrder))}}addShaderPass(e){e._isScenePass?(this.stacks.scenePasses.push(e),this.sortShaderPassStack(this.stacks.scenePasses)):(this.stacks.renderPasses.push(e),this.sortShaderPassStack(this.stacks.renderPasses))}removeShaderPass(e){this.resetShaderPassStacks()}sortShaderPassStack(e){e.sort((t,i)=>t.index-i.index),e.sort((t,i)=>t.renderOrder-i.renderOrder)}enableShaderPass(){this.stacks.scenePasses.length&&this.stacks.renderPasses.length===0&&this.renderer.planes.length&&(this.renderer.state.scenePassIndex=0,this.renderer.bindFrameBuffer(this.stacks.scenePasses[0].target))}drawRenderPasses(){this.stacks.scenePasses.length&&this.stacks.renderPasses.length&&this.renderer.planes.length&&(this.renderer.state.scenePassIndex=0,this.renderer.bindFrameBuffer(this.stacks.scenePasses[0].target));for(let e=0;e<this.stacks.renderPasses.length;e++)this.stacks.renderPasses[e]._startDrawing(),this.renderer.clearDepth()}drawScenePasses(){for(let e=0;e<this.stacks.scenePasses.length;e++)this.stacks.scenePasses[e]._startDrawing()}drawPingPongStack(){for(let e=0;e<this.stacks.pingPong.length;e++){const t=this.stacks.pingPong[e];t&&t._startDrawing()}}drawStack(e){for(let t=0;t<this.stacks[e].length;t++){const i=this.stacks[e][t];i&&i._startDrawing()}}draw(){this.drawPingPongStack(),this.enableShaderPass(),this.drawStack("renderTargets"),this.drawRenderPasses(),this.renderer.setBlending(!1),this.drawStack("opaque"),this.stacks.transparent.length&&(this.renderer.setBlending(!0),this.drawStack("transparent")),this.drawScenePasses()}};class He{constructor(){this.geometries=[],this.clear()}clear(){this.textures=[],this.programs=[]}getGeometryFromID(e){return this.geometries.find(t=>t.id===e)}addGeometry(e,t,i){this.geometries.push({id:e,vertices:t,uvs:i})}isSameShader(e,t){return e.localeCompare(t)===0}getProgramFromShaders(e,t){return this.programs.find(i=>this.isSameShader(i.vsCode,e)&&this.isSameShader(i.fsCode,t))}addProgram(e){this.programs.push(e)}getTextureFromSource(e){const t=typeof e=="string"?e:e.src;return this.textures.find(i=>i.source&&i.source.src===t)}addTexture(e){this.getTextureFromSource(e.source)||this.textures.push(e)}removeTexture(e){this.textures=this.textures.filter(t=>t.uuid!==e.uuid)}}class Xe{constructor(){this.clear()}clear(){this.queue=[]}add(e,t=!1){const i={callback:e,keep:t,timeout:null};return i.timeout=setTimeout(()=>{this.queue.push(i)},0),i}execute(){this.queue.map(e=>{e.callback&&e.callback(),clearTimeout(this.queue.timeout)}),this.queue=this.queue.filter(e=>e.keep)}}class Ge{constructor({alpha:e,antialias:t,premultipliedAlpha:i,depth:s,failIfMajorPerformanceCaveat:r,preserveDrawingBuffer:a,stencil:o,container:l,pixelRatio:h,renderingScale:c,production:u,onError:d,onSuccess:f,onContextLost:_,onContextRestored:x,onDisposed:P,onSceneChange:v}){this.type="Renderer",this.alpha=e,this.antialias=t,this.premultipliedAlpha=i,this.depth=s,this.failIfMajorPerformanceCaveat=r,this.preserveDrawingBuffer=a,this.stencil=o,this.container=l,this.pixelRatio=h,this._renderingScale=c,this.production=u,this.onError=d,this.onSuccess=f,this.onContextLost=_,this.onContextRestored=x,this.onDisposed=P,this.onSceneChange=v,this.initState(),this.canvas=document.createElement("canvas");const m={alpha:this.alpha,premultipliedAlpha:this.premultipliedAlpha,antialias:this.antialias,depth:this.depth,failIfMajorPerformanceCaveat:this.failIfMajorPerformanceCaveat,preserveDrawingBuffer:this.preserveDrawingBuffer,stencil:this.stencil};if(this.gl=this.canvas.getContext("webgl2",m),this._isWebGL2=!!this.gl,this.gl||(this.gl=this.canvas.getContext("webgl",m)||this.canvas.getContext("experimental-webgl",m)),this.gl)this.onSuccess&&this.onSuccess();else{this.production||p(this.type+": WebGL context could not be created"),this.state.isActive=!1,this.onError&&this.onError();return}this.initRenderer()}initState(){this.state={isActive:!0,isContextLost:!0,drawingEnabled:!0,forceRender:!1,currentProgramID:null,currentGeometryID:null,forceBufferUpdate:!1,depthTest:null,blending:null,cullFace:null,frameBufferID:null,scenePassIndex:null,activeTexture:null,unpackAlignment:null,flipY:null,premultiplyAlpha:null}}initCallbackQueueManager(){this.nextRender=new Xe}initRenderer(){this.planes=[],this.renderTargets=[],this.shaderPasses=[],this.state.isContextLost=!1,this.state.maxTextureSize=this.gl.getParameter(this.gl.MAX_TEXTURE_SIZE),this.initCallbackQueueManager(),this.setBlendFunc(),this.setDepthFunc(),this.setDepthTest(!0),this.cache=new He,this.scene=new We(this),this.getExtensions(),this._contextLostHandler=this.contextLost.bind(this),this.canvas.addEventListener("webglcontextlost",this._contextLostHandler,!1),this._contextRestoredHandler=this.contextRestored.bind(this),this.canvas.addEventListener("webglcontextrestored",this._contextRestoredHandler,!1)}getExtensions(){this.extensions=[],this._isWebGL2?(this.extensions.EXT_color_buffer_float=this.gl.getExtension("EXT_color_buffer_float"),this.extensions.OES_texture_float_linear=this.gl.getExtension("OES_texture_float_linear"),this.extensions.EXT_texture_filter_anisotropic=this.gl.getExtension("EXT_texture_filter_anisotropic"),this.extensions.WEBGL_lose_context=this.gl.getExtension("WEBGL_lose_context")):(this.extensions.OES_vertex_array_object=this.gl.getExtension("OES_vertex_array_object"),this.extensions.OES_texture_float=this.gl.getExtension("OES_texture_float"),this.extensions.OES_texture_float_linear=this.gl.getExtension("OES_texture_float_linear"),this.extensions.OES_texture_half_float=this.gl.getExtension("OES_texture_half_float"),this.extensions.OES_texture_half_float_linear=this.gl.getExtension("OES_texture_half_float_linear"),this.extensions.EXT_texture_filter_anisotropic=this.gl.getExtension("EXT_texture_filter_anisotropic"),this.extensions.OES_element_index_uint=this.gl.getExtension("OES_element_index_uint"),this.extensions.OES_standard_derivatives=this.gl.getExtension("OES_standard_derivatives"),this.extensions.EXT_sRGB=this.gl.getExtension("EXT_sRGB"),this.extensions.WEBGL_depth_texture=this.gl.getExtension("WEBGL_depth_texture"),this.extensions.WEBGL_draw_buffers=this.gl.getExtension("WEBGL_draw_buffers"),this.extensions.WEBGL_lose_context=this.gl.getExtension("WEBGL_lose_context"))}contextLost(e){this.state.isContextLost=!0,this.state.isActive&&(e.preventDefault(),this.nextRender.add(()=>this.onContextLost&&this.onContextLost()))}restoreContext(){this.state.isActive&&(this.initState(),this.gl&&this.extensions.WEBGL_lose_context?this.extensions.WEBGL_lose_context.restoreContext():(!this.gl&&!this.production?p(this.type+": Could not restore the context because the context is not defined"):!this.extensions.WEBGL_lose_context&&!this.production&&p(this.type+": Could not restore the context because the restore context extension is not defined"),this.onError&&this.onError()))}isContextexFullyRestored(){let e=!0;for(let t=0;t<this.renderTargets.length;t++){this.renderTargets[t].textures[0]._canDraw||(e=!1);break}if(e)for(let t=0;t<this.planes.length;t++)if(this.planes[t]._canDraw){for(let i=0;i<this.planes[t].textures.length;i++)if(!this.planes[t].textures[i]._canDraw){e=!1;break}}else{e=!1;break}if(e)for(let t=0;t<this.shaderPasses.length;t++)if(this.shaderPasses[t]._canDraw){for(let i=0;i<this.shaderPasses[t].textures.length;i++)if(!this.shaderPasses[t].textures[i]._canDraw){e=!1;break}}else{e=!1;break}return e}contextRestored(){this.getExtensions(),this.setBlendFunc(),this.setDepthFunc(),this.setDepthTest(!0),this.cache.clear(),this.scene.initStacks();for(let t=0;t<this.renderTargets.length;t++)this.renderTargets[t]._restoreContext();for(let t=0;t<this.planes.length;t++)this.planes[t]._restoreContext();for(let t=0;t<this.shaderPasses.length;t++)this.shaderPasses[t]._restoreContext();const e=this.nextRender.add(()=>{this.isContextexFullyRestored()&&(e.keep=!1,this.state.isContextLost=!1,this.onContextRestored&&this.onContextRestored(),this.onSceneChange(),this.needRender())},!0)}setPixelRatio(e){this.pixelRatio=e}setSize(){if(!this.gl)return;const e=this.container.getBoundingClientRect();this._boundingRect={width:e.width*this.pixelRatio,height:e.height*this.pixelRatio,top:e.top*this.pixelRatio,left:e.left*this.pixelRatio};const t=!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/),i=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream;if(t&&i){let s=function(r){let a=0;for(;r&&!isNaN(r.offsetTop);)a+=r.offsetTop-r.scrollTop,r=r.offsetParent;return a};this._boundingRect.top=s(this.container)*this.pixelRatio}this.canvas.style.width=Math.floor(this._boundingRect.width/this.pixelRatio)+"px",this.canvas.style.height=Math.floor(this._boundingRect.height/this.pixelRatio)+"px",this.canvas.width=Math.floor(this._boundingRect.width*this._renderingScale),this.canvas.height=Math.floor(this._boundingRect.height*this._renderingScale),this.gl.viewport(0,0,this.gl.drawingBufferWidth,this.gl.drawingBufferHeight)}resize(){for(let e=0;e<this.planes.length;e++)this.planes[e]._canDraw&&this.planes[e].resize();for(let e=0;e<this.shaderPasses.length;e++)this.shaderPasses[e]._canDraw&&this.shaderPasses[e].resize();for(let e=0;e<this.renderTargets.length;e++)this.renderTargets[e].resize();this.needRender()}clear(){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)}clearDepth(){this.gl.clear(this.gl.DEPTH_BUFFER_BIT)}clearColor(){this.gl.clear(this.gl.COLOR_BUFFER_BIT)}bindFrameBuffer(e,t){let i=null;e?(i=e.index,i!==this.state.frameBufferID&&(this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,e._frameBuffer),this.gl.viewport(0,0,e._size.width,e._size.height),e._shouldClear&&!t&&this.clear())):this.state.frameBufferID!==null&&(this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.viewport(0,0,this.gl.drawingBufferWidth,this.gl.drawingBufferHeight)),this.state.frameBufferID=i}setDepthTest(e){e&&!this.state.depthTest?(this.state.depthTest=e,this.gl.enable(this.gl.DEPTH_TEST)):!e&&this.state.depthTest&&(this.state.depthTest=e,this.gl.disable(this.gl.DEPTH_TEST))}setDepthFunc(){this.gl.depthFunc(this.gl.LEQUAL)}setBlending(e=!1){e&&!this.state.blending?(this.state.blending=e,this.gl.enable(this.gl.BLEND)):!e&&this.state.blending&&(this.state.blending=e,this.gl.disable(this.gl.BLEND))}setBlendFunc(){this.gl.enable(this.gl.BLEND),this.premultipliedAlpha?this.gl.blendFuncSeparate(this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA):this.gl.blendFuncSeparate(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA,this.gl.ONE,this.gl.ONE_MINUS_SRC_ALPHA)}setFaceCulling(e){if(this.state.cullFace!==e)if(this.state.cullFace=e,e==="none")this.gl.disable(this.gl.CULL_FACE);else{const t=e==="front"?this.gl.FRONT:this.gl.BACK;this.gl.enable(this.gl.CULL_FACE),this.gl.cullFace(t)}}useProgram(e){(this.state.currentProgramID===null||this.state.currentProgramID!==e.id)&&(this.gl.useProgram(e.program),this.state.currentProgramID=e.id)}removePlane(e){this.gl&&(this.planes=this.planes.filter(t=>t.uuid!==e.uuid),this.scene.removePlane(e),e=null,this.gl&&this.clear(),this.onSceneChange())}removeRenderTarget(e){if(!this.gl)return;let t=this.planes.find(i=>i.type!=="PingPongPlane"&&i.target&&i.target.uuid===e.uuid);for(let i=0;i<this.planes.length;i++)this.planes[i].target&&this.planes[i].target.uuid===e.uuid&&(this.planes[i].target=null);this.renderTargets=this.renderTargets.filter(i=>i.uuid!==e.uuid);for(let i=0;i<this.renderTargets.length;i++)this.renderTargets[i].index=i;e=null,this.gl&&this.clear(),t&&this.scene.resetPlaneStacks(),this.onSceneChange()}removeShaderPass(e){this.gl&&(this.shaderPasses=this.shaderPasses.filter(t=>t.uuid!==e.uuid),this.scene.removeShaderPass(e),e=null,this.gl&&this.clear(),this.onSceneChange())}enableDrawing(){this.state.drawingEnabled=!0}disableDrawing(){this.state.drawingEnabled=!1}needRender(){this.state.forceRender=!0}render(){this.gl&&(this.clear(),this.state.currentGeometryID=null,this.scene.draw())}deletePrograms(){for(let e=0;e<this.cache.programs.length;e++){const t=this.cache.programs[e];this.gl.deleteProgram(t.program)}}dispose(){if(!this.gl)return;for(this.state.isActive=!1;this.planes.length>0;)this.removePlane(this.planes[0]);for(;this.shaderPasses.length>0;)this.removeShaderPass(this.shaderPasses[0]);for(;this.renderTargets.length>0;)this.removeRenderTarget(this.renderTargets[0]);let e=this.nextRender.add(()=>{this.planes.length===0&&this.shaderPasses.length===0&&this.renderTargets.length===0&&(e.keep=!1,this.deletePrograms(),this.clear(),this.canvas.removeEventListener("webgllost",this._contextLostHandler,!1),this.canvas.removeEventListener("webglrestored",this._contextRestoredHandler,!1),this.gl&&this.extensions.WEBGL_lose_context&&this.extensions.WEBGL_lose_context.loseContext(),this.canvas.width=this.canvas.width,this.gl=null,this.container.removeChild(this.canvas),this.container=null,this.canvas=null,this.onDisposed&&this.onDisposed())},!0)}}class je{constructor({xOffset:e=0,yOffset:t=0,lastXDelta:i=0,lastYDelta:s=0,shouldWatch:r=!0,onScroll:a=()=>{}}={}){this.xOffset=e,this.yOffset=t,this.lastXDelta=i,this.lastYDelta=s,this.shouldWatch=r,this.onScroll=a,this.handler=this.scroll.bind(this,!0),this.shouldWatch&&window.addEventListener("scroll",this.handler,{passive:!0})}scroll(){this.updateScrollValues(window.pageXOffset,window.pageYOffset)}updateScrollValues(e,t){const i=this.xOffset;this.xOffset=e,this.lastXDelta=i-this.xOffset;const s=this.yOffset;this.yOffset=t,this.lastYDelta=s-this.yOffset,this.onScroll&&this.onScroll(this.lastXDelta,this.lastYDelta)}dispose(){this.shouldWatch&&window.removeEventListener("scroll",this.handler,{passive:!0})}}const mi="8.1.5";class qe{constructor({container:e,alpha:t=!0,premultipliedAlpha:i=!1,antialias:s=!0,depth:r=!0,failIfMajorPerformanceCaveat:a=!0,preserveDrawingBuffer:o=!1,stencil:l=!1,autoResize:h=!0,autoRender:c=!0,watchScroll:u=!0,pixelRatio:d=window.devicePixelRatio||1,renderingScale:f=1,production:_=!1}={}){this.type="Curtains",this._autoResize=h,this._autoRender=c,this._watchScroll=u,this.pixelRatio=d,f=isNaN(f)?1:parseFloat(f),this._renderingScale=Math.max(.25,Math.min(1,f)),this.premultipliedAlpha=i,this.alpha=t,this.antialias=s,this.depth=r,this.failIfMajorPerformanceCaveat=a,this.preserveDrawingBuffer=o,this.stencil=l,this.production=_,this.errors=!1,e?this.setContainer(e):this.production||p(this.type+": no container provided in the initial parameters. Use setContainer() method to set one later and initialize the WebGL context")}setContainer(e){if(e)if(typeof e=="string")if(e=document.getElementById(e),e)this.container=e;else{let t=document.createElement("div");t.setAttribute("id","curtains-canvas"),document.body.appendChild(t),this.container=t,this.production||p('Curtains: no valid container HTML element or ID provided, created a div with "curtains-canvas" ID instead')}else e instanceof Element&&(this.container=e);else{let t=document.createElement("div");t.setAttribute("id","curtains-canvas"),document.body.appendChild(t),this.container=t,this.production||p('Curtains: no valid container HTML element or ID provided, created a div with "curtains-canvas" ID instead')}this._initCurtains()}_initCurtains(){this.planes=[],this.renderTargets=[],this.shaderPasses=[],this._initRenderer(),this.gl&&(this._initScroll(),this._setSize(),this._addListeners(),this.container.appendChild(this.canvas),this._animationFrameID=null,this._autoRender&&this._animate())}_initRenderer(){this.renderer=new Ge({alpha:this.alpha,antialias:this.antialias,premultipliedAlpha:this.premultipliedAlpha,depth:this.depth,failIfMajorPerformanceCaveat:this.failIfMajorPerformanceCaveat,preserveDrawingBuffer:this.preserveDrawingBuffer,stencil:this.stencil,container:this.container,pixelRatio:this.pixelRatio,renderingScale:this._renderingScale,production:this.production,onError:()=>this._onRendererError(),onSuccess:()=>this._onRendererSuccess(),onContextLost:()=>this._onRendererContextLost(),onContextRestored:()=>this._onRendererContextRestored(),onDisposed:()=>this._onRendererDisposed(),onSceneChange:()=>this._keepSync()}),this.gl=this.renderer.gl,this.canvas=this.renderer.canvas}restoreContext(){this.renderer.restoreContext()}_animate(){this.render(),this._animationFrameID=window.requestAnimationFrame(this._animate.bind(this))}enableDrawing(){this.renderer.enableDrawing()}disableDrawing(){this.renderer.disableDrawing()}needRender(){this.renderer.needRender()}nextRender(e,t=!1){return this.renderer.nextRender.add(e,t)}clear(){this.renderer&&this.renderer.clear()}clearDepth(){this.renderer&&this.renderer.clearDepth()}clearColor(){this.renderer&&this.renderer.clearColor()}isWebGL2(){return this.gl?this.renderer._isWebGL2:!1}render(){this.renderer.nextRender.execute(),!(!this.renderer.state.drawingEnabled&&!this.renderer.state.forceRender)&&(this.renderer.state.forceRender&&(this.renderer.state.forceRender=!1),this._onRenderCallback&&this._onRenderCallback(),this.renderer.render())}_addListeners(){this._resizeHandler=null,this._autoResize&&(this._resizeHandler=this.resize.bind(this,!0),window.addEventListener("resize",this._resizeHandler,!1))}setPixelRatio(e,t){this.pixelRatio=parseFloat(Math.max(e,1))||1,this.renderer.setPixelRatio(e),this.resize(t)}_setSize(){this.renderer.setSize(),this._scrollManager.shouldWatch&&(this._scrollManager.xOffset=window.pageXOffset,this._scrollManager.yOffset=window.pageYOffset)}getBoundingRect(){return this.renderer._boundingRect}resize(e){this.gl&&(this._setSize(),this.renderer.resize(),this.nextRender(()=>{this._onAfterResizeCallback&&e&&this._onAfterResizeCallback()}))}_initScroll(){this._scrollManager=new je({xOffset:window.pageXOffset,yOffset:window.pageYOffset,lastXDelta:0,lastYDelta:0,shouldWatch:this._watchScroll,onScroll:(e,t)=>this._updateScroll(e,t)})}_updateScroll(e,t){for(let i=0;i<this.planes.length;i++)this.planes[i].watchScroll&&this.planes[i].updateScrollPosition(e,t);this.renderer.needRender(),this._onScrollCallback&&this._onScrollCallback()}updateScrollValues(e,t){this._scrollManager.updateScrollValues(e,t)}getScrollDeltas(){return{x:this._scrollManager.lastXDelta,y:this._scrollManager.lastYDelta}}getScrollValues(){return{x:this._scrollManager.xOffset,y:this._scrollManager.yOffset}}_keepSync(){this.planes=this.renderer.planes,this.shaderPasses=this.renderer.shaderPasses,this.renderTargets=this.renderer.renderTargets}lerp(e,t,i){return Be(e,t,i)}onAfterResize(e){return e&&(this._onAfterResizeCallback=e),this}onError(e){return e&&(this._onErrorCallback=e),this}_onRendererError(){setTimeout(()=>{this._onErrorCallback&&!this.errors&&this._onErrorCallback(),this.errors=!0},0)}onSuccess(e){return e&&(this._onSuccessCallback=e),this}_onRendererSuccess(){setTimeout(()=>{this._onSuccessCallback&&this._onSuccessCallback()},0)}onContextLost(e){return e&&(this._onContextLostCallback=e),this}_onRendererContextLost(){this._onContextLostCallback&&this._onContextLostCallback()}onContextRestored(e){return e&&(this._onContextRestoredCallback=e),this}_onRendererContextRestored(){this._onContextRestoredCallback&&this._onContextRestoredCallback()}onRender(e){return e&&(this._onRenderCallback=e),this}onScroll(e){return e&&(this._onScrollCallback=e),this}dispose(){this.renderer.dispose()}_onRendererDisposed(){this._animationFrameID&&window.cancelAnimationFrame(this._animationFrameID),this._resizeHandler&&window.removeEventListener("resize",this._resizeHandler,!1),this._scrollManager&&this._scrollManager.dispose()}}class Ye{constructor(e,t,i){if(this.type="Uniforms",!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){z(this.type+": Renderer WebGL context is undefined",e);return}if(this.renderer=e,this.gl=e.gl,this.program=t,this.uniforms={},i)for(const s in i){const r=i[s];this.uniforms[s]={name:r.name,type:r.type,value:r.value.clone&&typeof r.value.clone=="function"?r.value.clone():r.value,update:null}}}handleUniformSetting(e){switch(e.type){case"1i":e.update=this.setUniform1i.bind(this);break;case"1iv":e.update=this.setUniform1iv.bind(this);break;case"1f":e.update=this.setUniform1f.bind(this);break;case"1fv":e.update=this.setUniform1fv.bind(this);break;case"2i":e.update=this.setUniform2i.bind(this);break;case"2iv":e.update=this.setUniform2iv.bind(this);break;case"2f":e.update=this.setUniform2f.bind(this);break;case"2fv":e.update=this.setUniform2fv.bind(this);break;case"3i":e.update=this.setUniform3i.bind(this);break;case"3iv":e.update=this.setUniform3iv.bind(this);break;case"3f":e.update=this.setUniform3f.bind(this);break;case"3fv":e.update=this.setUniform3fv.bind(this);break;case"4i":e.update=this.setUniform4i.bind(this);break;case"4iv":e.update=this.setUniform4iv.bind(this);break;case"4f":e.update=this.setUniform4f.bind(this);break;case"4fv":e.update=this.setUniform4fv.bind(this);break;case"mat2":e.update=this.setUniformMatrix2fv.bind(this);break;case"mat3":e.update=this.setUniformMatrix3fv.bind(this);break;case"mat4":e.update=this.setUniformMatrix4fv.bind(this);break;default:this.renderer.production||p(this.type+": This uniform type is not handled : ",e.type)}}setInternalFormat(e){e.value.type==="Vec2"?(e._internalFormat="Vec2",e.lastValue=e.value.clone()):e.value.type==="Vec3"?(e._internalFormat="Vec3",e.lastValue=e.value.clone()):e.value.type==="Mat4"?(e._internalFormat="Mat4",e.lastValue=e.value.clone()):e.value.type==="Quat"?(e._internalFormat="Quat",e.lastValue=e.value.clone()):Array.isArray(e.value)?(e._internalFormat="array",e.lastValue=Array.from(e.value)):e.value.constructor===Float32Array?(e._internalFormat="mat",e.lastValue=e.value):(e._internalFormat="float",e.lastValue=e.value)}setUniforms(){if(this.uniforms)for(const e in this.uniforms){let t=this.uniforms[e];t.location=this.gl.getUniformLocation(this.program,t.name),t._internalFormat||this.setInternalFormat(t),t.type||(t._internalFormat==="Vec2"?t.type="2f":t._internalFormat==="Vec3"?t.type="3f":t._internalFormat==="Mat4"?t.type="mat4":t._internalFormat==="array"?t.value.length===4?(t.type="4f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 4f (array of 4 floats) uniform type")):t.value.length===3?(t.type="3f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 3f (array of 3 floats) uniform type")):t.value.length===2&&(t.type="2f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 2f (array of 2 floats) uniform type")):t._internalFormat==="mat"?t.value.length===16?(t.type="mat4",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a mat4 (4x4 matrix array) uniform type")):t.value.length===9?(t.type="mat3",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a mat3 (3x3 matrix array) uniform type")):t.value.length===4&&(t.type="mat2",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a mat2 (2x2 matrix array) uniform type")):(t.type="1f",this.renderer.production||p(this.type+": No uniform type declared for "+t.name+", applied a 1f (float) uniform type"))),this.handleUniformSetting(t),t.update&&t.update(t)}}updateUniforms(){if(this.uniforms)for(const e in this.uniforms){const t=this.uniforms[e];let i=!1;t._internalFormat==="Vec2"||t._internalFormat==="Vec3"||t._internalFormat==="Quat"?t.value.equals(t.lastValue)||(i=!0,t.lastValue.copy(t.value)):t.value.length?JSON.stringify(t.value)!==JSON.stringify(t.lastValue)&&(i=!0,t.lastValue=Array.from(t.value)):t.value!==t.lastValue&&(i=!0,t.lastValue=t.value),i&&t.update&&t.update(t)}}setUniform1i(e){this.gl.uniform1i(e.location,e.value)}setUniform1iv(e){this.gl.uniform1iv(e.location,e.value)}setUniform1f(e){this.gl.uniform1f(e.location,e.value)}setUniform1fv(e){this.gl.uniform1fv(e.location,e.value)}setUniform2i(e){e._internalFormat==="Vec2"?this.gl.uniform2i(e.location,e.value.x,e.value.y):this.gl.uniform2i(e.location,e.value[0],e.value[1])}setUniform2iv(e){e._internalFormat==="Vec2"?this.gl.uniform2iv(e.location,[e.value.x,e.value.y]):this.gl.uniform2iv(e.location,e.value)}setUniform2f(e){e._internalFormat==="Vec2"?this.gl.uniform2f(e.location,e.value.x,e.value.y):this.gl.uniform2f(e.location,e.value[0],e.value[1])}setUniform2fv(e){e._internalFormat==="Vec2"?this.gl.uniform2fv(e.location,[e.value.x,e.value.y]):this.gl.uniform2fv(e.location,e.value)}setUniform3i(e){e._internalFormat==="Vec3"?this.gl.uniform3i(e.location,e.value.x,e.value.y,e.value.z):this.gl.uniform3i(e.location,e.value[0],e.value[1],e.value[2])}setUniform3iv(e){e._internalFormat==="Vec3"?this.gl.uniform3iv(e.location,[e.value.x,e.value.y,e.value.z]):this.gl.uniform3iv(e.location,e.value)}setUniform3f(e){e._internalFormat==="Vec3"?this.gl.uniform3f(e.location,e.value.x,e.value.y,e.value.z):this.gl.uniform3f(e.location,e.value[0],e.value[1],e.value[2])}setUniform3fv(e){e._internalFormat==="Vec3"?this.gl.uniform3fv(e.location,[e.value.x,e.value.y,e.value.z]):this.gl.uniform3fv(e.location,e.value)}setUniform4i(e){e._internalFormat==="Quat"?this.gl.uniform4i(e.location,e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]):this.gl.uniform4i(e.location,e.value[0],e.value[1],e.value[2],e.value[3])}setUniform4iv(e){e._internalFormat==="Quat"?this.gl.uniform4iv(e.location,[e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]]):this.gl.uniform4iv(e.location,e.value)}setUniform4f(e){e._internalFormat==="Quat"?this.gl.uniform4f(e.location,e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]):this.gl.uniform4f(e.location,e.value[0],e.value[1],e.value[2],e.value[3])}setUniform4fv(e){e._internalFormat==="Quat"?this.gl.uniform4fv(e.location,[e.value.elements[0],e.value.elements[1],e.value.elements[2],e.value[3]]):this.gl.uniform4fv(e.location,e.value)}setUniformMatrix2fv(e){this.gl.uniformMatrix2fv(e.location,!1,e.value)}setUniformMatrix3fv(e){this.gl.uniformMatrix3fv(e.location,!1,e.value)}setUniformMatrix4fv(e){e._internalFormat==="Mat4"?this.gl.uniformMatrix4fv(e.location,!1,e.value.elements):this.gl.uniformMatrix4fv(e.location,!1,e.value)}}const ae=`
precision mediump float;
`.replace(/\n/g,""),xe=`
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
`.replace(/\n/g,""),ne=`
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
`.replace(/\n/g,""),$e=(ae+xe+ne+`
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}
`).replace(/\n/g,""),Qe=(ae+ne+`
void main() {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`).replace(/\n/g,""),Ze=(ae+xe+ne+`
void main() {
    vTextureCoord = aTextureCoord;
    vVertexPosition = aVertexPosition;
    
    gl_Position = vec4(aVertexPosition, 1.0);
}
`).replace(/\n/g,""),Ke=(ae+ne+`
uniform sampler2D uRenderTexture;

void main() {
    gl_FragColor = texture2D(uRenderTexture, vTextureCoord);
}
`).replace(/\n/g,"");let ve=0;class _e{constructor(e,{parent:t,vertexShader:i,fragmentShader:s}={}){if(this.type="Program",!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){z(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=this.renderer.gl,this.parent=t,this.defaultVsCode=this.parent.type==="Plane"?$e:Ze,this.defaultFsCode=this.parent.type==="Plane"?Qe:Ke,i?this.vsCode=i:(!this.renderer.production&&this.parent.type==="Plane"&&p(this.parent.type+": No vertex shader provided, will use a default one"),this.vsCode=this.defaultVsCode),s?this.fsCode=s:(this.renderer.production||p(this.parent.type+": No fragment shader provided, will use a default one"),this.fsCode=this.defaultFsCode),this.compiled=!0,this.setupProgram()}createShader(e,t){const i=this.gl.createShader(t);if(this.gl.shaderSource(i,e),this.gl.compileShader(i),!this.renderer.production&&!this.gl.getShaderParameter(i,this.gl.COMPILE_STATUS)){const s=t===this.gl.VERTEX_SHADER?"vertex shader":"fragment shader";let a=this.gl.getShaderSource(i).split(`
`);for(let o=0;o<a.length;o++)a[o]=o+1+": "+a[o];return a=a.join(`
`),p(this.type+": Errors occurred while compiling the",s,`:
`,this.gl.getShaderInfoLog(i)),z(a),p(this.type+": Will use a default",s),this.createShader(t===this.gl.VERTEX_SHADER?this.defaultVsCode:this.defaultFsCode,t)}return i}useNewShaders(){this.vertexShader=this.createShader(this.vsCode,this.gl.VERTEX_SHADER),this.fragmentShader=this.createShader(this.fsCode,this.gl.FRAGMENT_SHADER),(!this.vertexShader||!this.fragmentShader)&&(this.renderer.production||p(this.type+": Unable to find or compile the vertex or fragment shader"))}setupProgram(){let e=this.renderer.cache.getProgramFromShaders(this.vsCode,this.fsCode);e?(this.vertexShader=e.vertexShader,this.fragmentShader=e.fragmentShader,this.activeUniforms=e.activeUniforms,this.activeAttributes=e.activeAttributes,this.createProgram()):(this.useNewShaders(),this.compiled&&(this.createProgram(),this.renderer.cache.addProgram(this)))}createProgram(){if(ve++,this.id=ve,this.program=this.gl.createProgram(),this.gl.attachShader(this.program,this.vertexShader),this.gl.attachShader(this.program,this.fragmentShader),this.gl.linkProgram(this.program),!this.renderer.production&&!this.gl.getProgramParameter(this.program,this.gl.LINK_STATUS)){p(this.type+": Unable to initialize the shader program: "+this.gl.getProgramInfoLog(this.program)),p(this.type+": Will use default vertex and fragment shaders"),this.vertexShader=this.createShader(this.defaultVsCode,this.gl.VERTEX_SHADER),this.fragmentShader=this.createShader(this.defaultFsCode,this.gl.FRAGMENT_SHADER),this.createProgram();return}if(this.gl.deleteShader(this.vertexShader),this.gl.deleteShader(this.fragmentShader),!this.activeUniforms||!this.activeAttributes){this.activeUniforms={textures:[],textureMatrices:[]};const e=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_UNIFORMS);for(let i=0;i<e;i++){const s=this.gl.getActiveUniform(this.program,i);s.type===this.gl.SAMPLER_2D&&this.activeUniforms.textures.push(s.name),s.type===this.gl.FLOAT_MAT4&&s.name!=="uMVMatrix"&&s.name!=="uPMatrix"&&this.activeUniforms.textureMatrices.push(s.name)}this.activeAttributes=[];const t=this.gl.getProgramParameter(this.program,this.gl.ACTIVE_ATTRIBUTES);for(let i=0;i<t;i++){const s=this.gl.getActiveAttrib(this.program,i);this.activeAttributes.push(s.name)}}}createUniforms(e){this.uniformsManager=new Ye(this.renderer,this.program,e),this.setUniforms()}setUniforms(){this.renderer.useProgram(this),this.uniformsManager.setUniforms()}updateUniforms(){this.renderer.useProgram(this),this.uniformsManager.updateUniforms()}}class Je{constructor(e,{program:t=null,width:i=1,height:s=1}={}){if(this.type="Geometry",!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){z(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=this.renderer.gl,this.definition={id:i*s+i,width:i,height:s},this.setDefaultAttributes(),this.setVerticesUVs()}restoreContext(e){this.program=null,this.setDefaultAttributes(),this.setVerticesUVs(),this.setProgram(e)}setDefaultAttributes(){this.attributes={vertexPosition:{name:"aVertexPosition",size:3,isActive:!1},textureCoord:{name:"aTextureCoord",size:3,isActive:!1}}}setVerticesUVs(){const e=this.renderer.cache.getGeometryFromID(this.definition.id);e?(this.attributes.vertexPosition.array=e.vertices,this.attributes.textureCoord.array=e.uvs):(this.computeVerticesUVs(),this.renderer.cache.addGeometry(this.definition.id,this.attributes.vertexPosition.array,this.attributes.textureCoord.array))}setProgram(e){this.program=e,this.initAttributes(),this.renderer._isWebGL2?(this._vao=this.gl.createVertexArray(),this.gl.bindVertexArray(this._vao)):this.renderer.extensions.OES_vertex_array_object&&(this._vao=this.renderer.extensions.OES_vertex_array_object.createVertexArrayOES(),this.renderer.extensions.OES_vertex_array_object.bindVertexArrayOES(this._vao)),this.initializeBuffers()}initAttributes(){for(const e in this.attributes){if(this.attributes[e].isActive=this.program.activeAttributes.includes(this.attributes[e].name),!this.attributes[e].isActive)return;this.attributes[e].location=this.gl.getAttribLocation(this.program.program,this.attributes[e].name),this.attributes[e].buffer=this.gl.createBuffer(),this.attributes[e].numberOfItems=this.definition.width*this.definition.height*this.attributes[e].size*2}}computeVerticesUVs(){this.attributes.vertexPosition.array=[],this.attributes.textureCoord.array=[];const e=this.attributes.vertexPosition.array,t=this.attributes.textureCoord.array;for(let i=0;i<this.definition.height;i++){const s=i/this.definition.height;for(let r=0;r<this.definition.width;r++){const a=r/this.definition.width;t.push(a),t.push(s),t.push(0),e.push((a-.5)*2),e.push((s-.5)*2),e.push(0),t.push(a+1/this.definition.width),t.push(s),t.push(0),e.push((a+1/this.definition.width-.5)*2),e.push((s-.5)*2),e.push(0),t.push(a),t.push(s+1/this.definition.height),t.push(0),e.push((a-.5)*2),e.push((s+1/this.definition.height-.5)*2),e.push(0),t.push(a),t.push(s+1/this.definition.height),t.push(0),e.push((a-.5)*2),e.push((s+1/this.definition.height-.5)*2),e.push(0),t.push(a+1/this.definition.width),t.push(s),t.push(0),e.push((a+1/this.definition.width-.5)*2),e.push((s-.5)*2),e.push(0),t.push(a+1/this.definition.width),t.push(s+1/this.definition.height),t.push(0),e.push((a+1/this.definition.width-.5)*2),e.push((s+1/this.definition.height-.5)*2),e.push(0)}}}initializeBuffers(){if(this.attributes){for(const e in this.attributes){if(!this.attributes[e].isActive)return;this.gl.enableVertexAttribArray(this.attributes[e].location),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.attributes[e].buffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(this.attributes[e].array),this.gl.STATIC_DRAW),this.gl.vertexAttribPointer(this.attributes[e].location,this.attributes[e].size,this.gl.FLOAT,!1,0,0)}this.renderer.state.currentGeometryID=this.definition.id}}bindBuffers(){if(this._vao)this.renderer._isWebGL2?this.gl.bindVertexArray(this._vao):this.renderer.extensions.OES_vertex_array_object.bindVertexArrayOES(this._vao);else for(const e in this.attributes){if(!this.attributes[e].isActive)return;this.gl.enableVertexAttribArray(this.attributes[e].location),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.attributes[e].buffer),this.gl.vertexAttribPointer(this.attributes[e].location,this.attributes[e].size,this.gl.FLOAT,!1,0,0)}this.renderer.state.currentGeometryID=this.definition.id}draw(){this.gl.drawArrays(this.gl.TRIANGLES,0,this.attributes.vertexPosition.numberOfItems)}dispose(){this._vao&&(this.renderer._isWebGL2?this.gl.deleteVertexArray(this._vao):this.renderer.extensions.OES_vertex_array_object.deleteVertexArrayOES(this._vao));for(const e in this.attributes){if(!this.attributes[e].isActive)return;this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.attributes[e].buffer),this.gl.bufferData(this.gl.ARRAY_BUFFER,1,this.gl.STATIC_DRAW),this.gl.deleteBuffer(this.attributes[e].buffer)}this.attributes=null,this.renderer.state.currentGeometryID=null}}class H{constructor(e=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])){this.type="Mat4",this.elements=e}setFromArray(e){for(let t=0;t<this.elements.length;t++)this.elements[t]=e[t];return this}copy(e){const t=e.elements;return this.elements[0]=t[0],this.elements[1]=t[1],this.elements[2]=t[2],this.elements[3]=t[3],this.elements[4]=t[4],this.elements[5]=t[5],this.elements[6]=t[6],this.elements[7]=t[7],this.elements[8]=t[8],this.elements[9]=t[9],this.elements[10]=t[10],this.elements[11]=t[11],this.elements[12]=t[12],this.elements[13]=t[13],this.elements[14]=t[14],this.elements[15]=t[15],this}clone(){return new H().copy(this)}multiply(e){const t=this.elements,i=e.elements;let s=new H;return s.elements[0]=i[0]*t[0]+i[1]*t[4]+i[2]*t[8]+i[3]*t[12],s.elements[1]=i[0]*t[1]+i[1]*t[5]+i[2]*t[9]+i[3]*t[13],s.elements[2]=i[0]*t[2]+i[1]*t[6]+i[2]*t[10]+i[3]*t[14],s.elements[3]=i[0]*t[3]+i[1]*t[7]+i[2]*t[11]+i[3]*t[15],s.elements[4]=i[4]*t[0]+i[5]*t[4]+i[6]*t[8]+i[7]*t[12],s.elements[5]=i[4]*t[1]+i[5]*t[5]+i[6]*t[9]+i[7]*t[13],s.elements[6]=i[4]*t[2]+i[5]*t[6]+i[6]*t[10]+i[7]*t[14],s.elements[7]=i[4]*t[3]+i[5]*t[7]+i[6]*t[11]+i[7]*t[15],s.elements[8]=i[8]*t[0]+i[9]*t[4]+i[10]*t[8]+i[11]*t[12],s.elements[9]=i[8]*t[1]+i[9]*t[5]+i[10]*t[9]+i[11]*t[13],s.elements[10]=i[8]*t[2]+i[9]*t[6]+i[10]*t[10]+i[11]*t[14],s.elements[11]=i[8]*t[3]+i[9]*t[7]+i[10]*t[11]+i[11]*t[15],s.elements[12]=i[12]*t[0]+i[13]*t[4]+i[14]*t[8]+i[15]*t[12],s.elements[13]=i[12]*t[1]+i[13]*t[5]+i[14]*t[9]+i[15]*t[13],s.elements[14]=i[12]*t[2]+i[13]*t[6]+i[14]*t[10]+i[15]*t[14],s.elements[15]=i[12]*t[3]+i[13]*t[7]+i[14]*t[11]+i[15]*t[15],s}getInverse(){const e=this.elements,t=new H,i=t.elements;let s=e[0],r=e[1],a=e[2],o=e[3],l=e[4],h=e[5],c=e[6],u=e[7],d=e[8],f=e[9],_=e[10],x=e[11],P=e[12],v=e[13],m=e[14],g=e[15],b=s*h-r*l,R=s*c-a*l,w=s*u-o*l,S=r*c-a*h,k=r*u-o*h,C=a*u-o*c,E=d*v-f*P,M=d*m-_*P,D=d*g-x*P,G=f*m-_*v,$=f*g-x*v,Q=_*g-x*m,I=b*Q-R*$+w*G+S*D-k*M+C*E;return I?(I=1/I,i[0]=(h*Q-c*$+u*G)*I,i[1]=(a*$-r*Q-o*G)*I,i[2]=(v*C-m*k+g*S)*I,i[3]=(_*k-f*C-x*S)*I,i[4]=(c*D-l*Q-u*M)*I,i[5]=(s*Q-a*D+o*M)*I,i[6]=(m*w-P*C-g*R)*I,i[7]=(d*C-_*w+x*R)*I,i[8]=(l*$-h*D+u*E)*I,i[9]=(r*D-s*$-o*E)*I,i[10]=(P*k-v*w+g*b)*I,i[11]=(f*w-d*k-x*b)*I,i[12]=(h*M-l*G-c*E)*I,i[13]=(s*G-r*M+a*E)*I,i[14]=(v*R-P*S-m*b)*I,i[15]=(d*S-f*R+_*b)*I,t):null}scale(e){let t=this.elements;return t[0]*=e.x,t[1]*=e.x,t[2]*=e.x,t[3]*=e.x,t[4]*=e.y,t[5]*=e.y,t[6]*=e.y,t[7]*=e.y,t[8]*=e.z,t[9]*=e.z,t[10]*=e.z,t[11]*=e.z,this}compose(e,t,i){let s=this.elements;const r=t.elements[0],a=t.elements[1],o=t.elements[2],l=t.elements[3],h=r+r,c=a+a,u=o+o,d=r*h,f=r*c,_=r*u,x=a*c,P=a*u,v=o*u,m=l*h,g=l*c,b=l*u,R=i.x,w=i.y,S=i.z;return s[0]=(1-(x+v))*R,s[1]=(f+b)*R,s[2]=(_-g)*R,s[3]=0,s[4]=(f-b)*w,s[5]=(1-(d+v))*w,s[6]=(P+m)*w,s[7]=0,s[8]=(_+g)*S,s[9]=(P-m)*S,s[10]=(1-(d+x))*S,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}composeFromOrigin(e,t,i,s){let r=this.elements;const a=t.elements[0],o=t.elements[1],l=t.elements[2],h=t.elements[3],c=a+a,u=o+o,d=l+l,f=a*c,_=a*u,x=a*d,P=o*u,v=o*d,m=l*d,g=h*c,b=h*u,R=h*d,w=i.x,S=i.y,k=i.z,C=s.x,E=s.y,M=s.z,D=(1-(P+m))*w,G=(_+R)*w,$=(x-b)*w,Q=(_-R)*S,I=(1-(f+m))*S,Le=(v+g)*S,Ue=(x+b)*k,Ve=(v-g)*k,Ne=(1-(f+P))*k;return r[0]=D,r[1]=G,r[2]=$,r[3]=0,r[4]=Q,r[5]=I,r[6]=Le,r[7]=0,r[8]=Ue,r[9]=Ve,r[10]=Ne,r[11]=0,r[12]=e.x+C-(D*C+Q*E+Ue*M),r[13]=e.y+E-(G*C+I*E+Ve*M),r[14]=e.z+M-($*C+Le*E+Ne*M),r[15]=1,this}}class T{constructor(e=0,t=e){this.type="Vec2",this._x=e,this._y=t}get x(){return this._x}get y(){return this._y}set x(e){const t=e!==this._x;this._x=e,t&&this._onChangeCallback&&this._onChangeCallback()}set y(e){const t=e!==this._y;this._y=e,t&&this._onChangeCallback&&this._onChangeCallback()}onChange(e){return e&&(this._onChangeCallback=e),this}set(e,t){return this._x=e,this._y=t,this}add(e){return this._x+=e.x,this._y+=e.y,this}addScalar(e){return this._x+=e,this._y+=e,this}sub(e){return this._x-=e.x,this._y-=e.y,this}subScalar(e){return this._x-=e,this._y-=e,this}multiply(e){return this._x*=e.x,this._y*=e.y,this}multiplyScalar(e){return this._x*=e,this._y*=e,this}copy(e){return this._x=e.x,this._y=e.y,this}clone(){return new T(this._x,this._y)}sanitizeNaNValuesWith(e){return this._x=isNaN(this._x)?e.x:parseFloat(this._x),this._y=isNaN(this._y)?e.y:parseFloat(this._y),this}max(e){return this._x=Math.max(this._x,e.x),this._y=Math.max(this._y,e.y),this}min(e){return this._x=Math.min(this._x,e.x),this._y=Math.min(this._y,e.y),this}equals(e){return this._x===e.x&&this._y===e.y}normalize(){let e=this._x*this._x+this._y*this._y;return e>0&&(e=1/Math.sqrt(e)),this._x*=e,this._y*=e,this}dot(e){return this._x*e.x+this._y*e.y}}class A{constructor(e=0,t=e,i=e){this.type="Vec3",this._x=e,this._y=t,this._z=i}get x(){return this._x}get y(){return this._y}get z(){return this._z}set x(e){const t=e!==this._x;this._x=e,t&&this._onChangeCallback&&this._onChangeCallback()}set y(e){const t=e!==this._y;this._y=e,t&&this._onChangeCallback&&this._onChangeCallback()}set z(e){const t=e!==this._z;this._z=e,t&&this._onChangeCallback&&this._onChangeCallback()}onChange(e){return e&&(this._onChangeCallback=e),this}set(e,t,i){return this._x=e,this._y=t,this._z=i,this}add(e){return this._x+=e.x,this._y+=e.y,this._z+=e.z,this}addScalar(e){return this._x+=e,this._y+=e,this._z+=e,this}sub(e){return this._x-=e.x,this._y-=e.y,this._z-=e.z,this}subScalar(e){return this._x-=e,this._y-=e,this._z-=e,this}multiply(e){return this._x*=e.x,this._y*=e.y,this._z*=e.z,this}multiplyScalar(e){return this._x*=e,this._y*=e,this._z*=e,this}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this}clone(){return new A(this._x,this._y,this._z)}sanitizeNaNValuesWith(e){return this._x=isNaN(this._x)?e.x:parseFloat(this._x),this._y=isNaN(this._y)?e.y:parseFloat(this._y),this._z=isNaN(this._z)?e.z:parseFloat(this._z),this}max(e){return this._x=Math.max(this._x,e.x),this._y=Math.max(this._y,e.y),this._z=Math.max(this._z,e.z),this}min(e){return this._x=Math.min(this._x,e.x),this._y=Math.min(this._y,e.y),this._z=Math.min(this._z,e.z),this}equals(e){return this._x===e.x&&this._y===e.y&&this._z===e.z}normalize(){let e=this._x*this._x+this._y*this._y+this._z*this._z;return e>0&&(e=1/Math.sqrt(e)),this._x*=e,this._y*=e,this._z*=e,this}dot(e){return this._x*e.x+this._y*e.y+this._z*e.z}applyMat4(e){const t=this._x,i=this._y,s=this._z,r=e.elements;let a=r[3]*t+r[7]*i+r[11]*s+r[15];return a=a||1,this._x=(r[0]*t+r[4]*i+r[8]*s+r[12])/a,this._y=(r[1]*t+r[5]*i+r[9]*s+r[13])/a,this._z=(r[2]*t+r[6]*i+r[10]*s+r[14])/a,this}applyQuat(e){const t=this._x,i=this._y,s=this._z,r=e.elements[0],a=e.elements[1],o=e.elements[2],l=e.elements[3],h=l*t+a*s-o*i,c=l*i+o*t-r*s,u=l*s+r*i-a*t,d=-r*t-a*i-o*s;return this._x=h*l+d*-r+c*-o-u*-a,this._y=c*l+d*-a+u*-r-h*-o,this._z=u*l+d*-o+h*-a-c*-r,this}project(e){return this.applyMat4(e.viewMatrix).applyMat4(e.projectionMatrix),this}unproject(e){return this.applyMat4(e.projectionMatrix.getInverse()).applyMat4(e.worldMatrix),this}}const me=new T,et=new A,tt=new H;class ee{constructor(e,{isFBOTexture:t=!1,fromTexture:i=!1,loader:s,sampler:r,floatingPoint:a="none",premultiplyAlpha:o=!1,anisotropy:l=1,generateMipmap:h=null,wrapS:c,wrapT:u,minFilter:d,magFilter:f}={}){if(this.type="Texture",e=e&&e.renderer||e,!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){e.production||z(this.type+": Unable to create a "+this.type+" because the Renderer WebGL context is not defined");return}if(this.renderer=e,this.gl=this.renderer.gl,this.uuid=pe(),this._globalParameters={unpackAlignment:4,flipY:!t,premultiplyAlpha:!1,shouldPremultiplyAlpha:o,floatingPoint:a,type:this.gl.UNSIGNED_BYTE,internalFormat:this.gl.RGBA,format:this.gl.RGBA},this.parameters={anisotropy:l,generateMipmap:h,wrapS:c||this.gl.CLAMP_TO_EDGE,wrapT:u||this.gl.CLAMP_TO_EDGE,minFilter:d||this.gl.LINEAR,magFilter:f||this.gl.LINEAR,_shouldUpdate:!0},this._initState(),this.sourceType=t?"fbo":"empty",this._useCache=!0,this._samplerName=r,this._sampler={isActive:!1,isTextureBound:!1,texture:this.gl.createTexture()},this._textureMatrix={matrix:new H,isActive:!1},this._size={width:1,height:1},this.scale=new T(1),this.scale.onChange(()=>this.resize()),this.offset=new T,this.offset.onChange(()=>this.resize()),this._loader=s,this._sourceLoaded=!1,this._uploaded=!1,this._willUpdate=!1,this.shouldUpdate=!1,this._forceUpdate=!1,this.userData={},this._canDraw=!1,i){this._copyOnInit=!0,this._copiedFrom=i;return}this._copyOnInit=!1,this._initTexture()}_initState(){this._state={anisotropy:1,generateMipmap:!1,wrapS:null,wrapT:null,minFilter:null,magFilter:this.gl.LINEAR}}_initTexture(){this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this.sourceType==="empty"&&(this._globalParameters.flipY=!1,this._updateGlobalTexParameters(),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,1,1,0,this.gl.RGBA,this.gl.UNSIGNED_BYTE,new Uint8Array([0,0,0,255])),this._canDraw=!0)}_restoreFromTexture(){this._copyOnInit||this._initTexture(),this._parent&&(this._setTextureUniforms(),this._setSize()),this.copy(this._copiedFrom),this._canDraw=!0}_restoreContext(){if(this._canDraw=!1,this._sampler.texture=this.gl.createTexture(),this._sampler.isActive=!1,this._sampler.isTextureBound=!1,this._textureMatrix.isActive=!1,this._initState(),this._state.generateMipmap=!1,this.parameters._shouldUpdate=!0,!this._copiedFrom)this._initTexture(),this._parent&&this._setParent(),this.source&&(this.setSource(this.source),this.sourceType==="image"?this.renderer.cache.addTexture(this):this.needUpdate()),this._canDraw=!0;else{const e=this.renderer.nextRender.add(()=>{this._copiedFrom._canDraw&&(this._restoreFromTexture(),e.keep=!1)},!0)}}addParent(e){if(!e||e.type!=="Plane"&&e.type!=="PingPongPlane"&&e.type!=="ShaderPass"&&e.type!=="RenderTarget"){this.renderer.production||p(this.type+": cannot add texture as a child of ",e," because it is not a valid parent");return}this._parent=e,this.index=this._parent.textures.length,this._parent.textures.push(this),this._setParent()}_setParent(){if(this._sampler.name=this._samplerName||"uSampler"+this.index,this._textureMatrix.name=this._samplerName?this._samplerName+"Matrix":"uTextureMatrix"+this.index,this._parent._program){if(!this._parent._program.compiled){this.renderer.production||p(this.type+": Unable to create the texture because the program is not valid");return}if(this._setTextureUniforms(),this._copyOnInit){const e=this.renderer.nextRender.add(()=>{this._copiedFrom._canDraw&&this._copiedFrom._uploaded&&(this.copy(this._copiedFrom),e.keep=!1)},!0);return}this.source?this._parent.loader&&this._parent.loader._addSourceToParent(this.source,this.sourceType):this._size={width:this._parent._boundingRect.document.width,height:this._parent._boundingRect.document.height},this._setSize()}else this._parent.type==="RenderTarget"&&(this._size={width:this._parent._size&&this._parent._size.width||this.renderer._boundingRect.width,height:this._parent._size&&this._parent._size.height||this.renderer._boundingRect.height},this._upload(),this._updateTexParameters(),this._canDraw=!0)}hasParent(){return!!this._parent}_setTextureUniforms(){const e=this._parent._program.activeUniforms;for(let t=0;t<e.textures.length;t++)e.textures[t]===this._sampler.name&&(this._sampler.isActive=!0,this.renderer.useProgram(this._parent._program),this._sampler.location=this.gl.getUniformLocation(this._parent._program.program,this._sampler.name),e.textureMatrices.find(s=>s===this._textureMatrix.name)&&(this._textureMatrix.isActive=!0,this._textureMatrix.location=this.gl.getUniformLocation(this._parent._program.program,this._textureMatrix.name)),this.gl.uniform1i(this._sampler.location,this.index))}copy(e){if(!e||e.type!=="Texture"){this.renderer.production||p(this.type+": Unable to set the texture from texture:",e);return}this._globalParameters=Object.assign({},e._globalParameters),this._state=Object.assign({},e._state),this.parameters.generateMipmap=e.parameters.generateMipmap,this._state.generateMipmap=null,this._size=e._size,!this._sourceLoaded&&e._sourceLoaded&&this._onSourceLoadedCallback&&this._onSourceLoadedCallback(),this._sourceLoaded=e._sourceLoaded,!this._uploaded&&e._uploaded&&this._onSourceUploadedCallback&&this._onSourceUploadedCallback(),this._uploaded=e._uploaded,this.sourceType=e.sourceType,this.source=e.source,this._videoFrameCallbackID=e._videoFrameCallbackID,this._sampler.texture=e._sampler.texture,this._copiedFrom=e,this._parent&&this._parent._program&&(!this._canDraw||!this._textureMatrix.matrix)&&(this._setSize(),this._canDraw=!0),this._updateTexParameters(),this.renderer.needRender()}setSource(e){this._sourceLoaded||this.renderer.nextRender.add(()=>this._onSourceLoadedCallback&&this._onSourceLoadedCallback());const t=e.tagName.toUpperCase()==="IMG"?"image":e.tagName.toLowerCase();if((t==="video"||t==="canvas")&&(this._useCache=!1),this._useCache){const i=this.renderer.cache.getTextureFromSource(e);if(i&&i.uuid!==this.uuid){this._uploaded||(this.renderer.nextRender.add(()=>this._onSourceUploadedCallback&&this._onSourceUploadedCallback()),this._uploaded=!0),this.copy(i),this.resize();return}}if(this.sourceType==="empty"||this.sourceType!==t)if(t==="video")this._willUpdate=!1,this.shouldUpdate=!0;else if(t==="canvas")this._willUpdate=!0,this.shouldUpdate=!0;else if(t==="image")this._willUpdate=!1,this.shouldUpdate=!1;else{this.renderer.production||p(this.type+": this HTML tag could not be converted into a texture:",e.tagName);return}this.source=e,this.sourceType=t,this._size={width:this.source.naturalWidth||this.source.width||this.source.videoWidth,height:this.source.naturalHeight||this.source.height||this.source.videoHeight},this._sourceLoaded=!0,this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this.resize(),this._globalParameters.flipY=!0,this._globalParameters.premultiplyAlpha=this._globalParameters.shouldPremultiplyAlpha,this.sourceType==="image"&&(this.parameters.generateMipmap=this.parameters.generateMipmap||this.parameters.generateMipmap===null,this.parameters._shouldUpdate=this.parameters.generateMipmap,this._state.generateMipmap=!1,this._upload()),this.renderer.needRender()}_updateGlobalTexParameters(){this.renderer.state.unpackAlignment!==this._globalParameters.unpackAlignment&&(this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT,this._globalParameters.unpackAlignment),this.renderer.state.unpackAlignment=this._globalParameters.unpackAlignment),this.renderer.state.flipY!==this._globalParameters.flipY&&(this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL,this._globalParameters.flipY),this.renderer.state.flipY=this._globalParameters.flipY),this.renderer.state.premultiplyAlpha!==this._globalParameters.premultiplyAlpha&&(this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,this._globalParameters.premultiplyAlpha),this.renderer.state.premultiplyAlpha=this._globalParameters.premultiplyAlpha),this._globalParameters.floatingPoint==="half-float"?this.renderer._isWebGL2&&this.renderer.extensions.EXT_color_buffer_float?(this._globalParameters.internalFormat=this.gl.RGBA16F,this._globalParameters.type=this.gl.HALF_FLOAT):this.renderer.extensions.OES_texture_half_float?this._globalParameters.type=this.renderer.extensions.OES_texture_half_float.HALF_FLOAT_OES:this.renderer.production||p(this.type+": could not use half-float textures because the extension is not available"):this._globalParameters.floatingPoint==="float"&&(this.renderer._isWebGL2&&this.renderer.extensions.EXT_color_buffer_float?(this._globalParameters.internalFormat=this.gl.RGBA16F,this._globalParameters.type=this.gl.FLOAT):this.renderer.extensions.OES_texture_float?this._globalParameters.type=this.renderer.extensions.OES_texture_half_float.FLOAT:this.renderer.production||p(this.type+": could not use float textures because the extension is not available"))}_updateTexParameters(){this.index&&this.renderer.state.activeTexture!==this.index&&this._bindTexture(),this.parameters.wrapS!==this._state.wrapS&&(!this.renderer._isWebGL2&&(!W(this._size.width)||!W(this._size.height))&&(this.parameters.wrapS=this.gl.CLAMP_TO_EDGE),this.parameters.wrapS!==this.gl.REPEAT&&this.parameters.wrapS!==this.gl.CLAMP_TO_EDGE&&this.parameters.wrapS!==this.gl.MIRRORED_REPEAT&&(this.renderer.production||p(this.type+": Wrong wrapS value",this.parameters.wrapS,"for this texture:",this,`
gl.CLAMP_TO_EDGE wrapping will be used instead`),this.parameters.wrapS=this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_S,this.parameters.wrapS),this._state.wrapS=this.parameters.wrapS),this.parameters.wrapT!==this._state.wrapT&&(!this.renderer._isWebGL2&&(!W(this._size.width)||!W(this._size.height))&&(this.parameters.wrapT=this.gl.CLAMP_TO_EDGE),this.parameters.wrapT!==this.gl.REPEAT&&this.parameters.wrapT!==this.gl.CLAMP_TO_EDGE&&this.parameters.wrapT!==this.gl.MIRRORED_REPEAT&&(this.renderer.production||p(this.type+": Wrong wrapT value",this.parameters.wrapT,"for this texture:",this,`
gl.CLAMP_TO_EDGE wrapping will be used instead`),this.parameters.wrapT=this.gl.CLAMP_TO_EDGE),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_WRAP_T,this.parameters.wrapT),this._state.wrapT=this.parameters.wrapT),this.parameters.generateMipmap&&!this._state.generateMipmap&&this.source&&(!this.renderer._isWebGL2&&(!W(this._size.width)||!W(this._size.height))?this.parameters.generateMipmap=!1:this.gl.generateMipmap(this.gl.TEXTURE_2D),this._state.generateMipmap=this.parameters.generateMipmap),this.parameters.minFilter!==this._state.minFilter&&(!this.renderer._isWebGL2&&(!W(this._size.width)||!W(this._size.height))&&(this.parameters.minFilter=this.gl.LINEAR),!this.parameters.generateMipmap&&this.parameters.generateMipmap!==null&&(this.parameters.minFilter=this.gl.LINEAR),this.parameters.minFilter!==this.gl.LINEAR&&this.parameters.minFilter!==this.gl.NEAREST&&this.parameters.minFilter!==this.gl.NEAREST_MIPMAP_NEAREST&&this.parameters.minFilter!==this.gl.LINEAR_MIPMAP_NEAREST&&this.parameters.minFilter!==this.gl.NEAREST_MIPMAP_LINEAR&&this.parameters.minFilter!==this.gl.LINEAR_MIPMAP_LINEAR&&(this.renderer.production||p(this.type+": Wrong minFilter value",this.parameters.minFilter,"for this texture:",this,`
gl.LINEAR filtering will be used instead`),this.parameters.minFilter=this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MIN_FILTER,this.parameters.minFilter),this._state.minFilter=this.parameters.minFilter),this.parameters.magFilter!==this._state.magFilter&&(!this.renderer._isWebGL2&&(!W(this._size.width)||!W(this._size.height))&&(this.parameters.magFilter=this.gl.LINEAR),this.parameters.magFilter!==this.gl.LINEAR&&this.parameters.magFilter!==this.gl.NEAREST&&(this.renderer.production||p(this.type+": Wrong magFilter value",this.parameters.magFilter,"for this texture:",this,`
gl.LINEAR filtering will be used instead`),this.parameters.magFilter=this.gl.LINEAR),this.gl.texParameteri(this.gl.TEXTURE_2D,this.gl.TEXTURE_MAG_FILTER,this.parameters.magFilter),this._state.magFilter=this.parameters.magFilter);const e=this.renderer.extensions.EXT_texture_filter_anisotropic;if(e&&this.parameters.anisotropy!==this._state.anisotropy){const t=this.gl.getParameter(e.MAX_TEXTURE_MAX_ANISOTROPY_EXT);this.parameters.anisotropy=Math.max(1,Math.min(this.parameters.anisotropy,t)),this.gl.texParameterf(this.gl.TEXTURE_2D,e.TEXTURE_MAX_ANISOTROPY_EXT,this.parameters.anisotropy),this._state.anisotropy=this.parameters.anisotropy}}setWrapS(e){this.parameters.wrapS!==e&&(this.parameters.wrapS=e,this.parameters._shouldUpdate=!0)}setWrapT(e){this.parameters.wrapT!==e&&(this.parameters.wrapT=e,this.parameters._shouldUpdate=!0)}setMinFilter(e){this.parameters.minFilter!==e&&(this.parameters.minFilter=e,this.parameters._shouldUpdate=!0)}setMagFilter(e){this.parameters.magFilter!==e&&(this.parameters.magFilter=e,this.parameters._shouldUpdate=!0)}setAnisotropy(e){e=isNaN(e)?this.parameters.anisotropy:e,this.parameters.anisotropy!==e&&(this.parameters.anisotropy=e,this.parameters._shouldUpdate=!0)}needUpdate(){this._forceUpdate=!0}_videoFrameCallback(){this._willUpdate=!0,this.source.requestVideoFrameCallback(()=>this._videoFrameCallback())}_upload(){this._updateGlobalTexParameters(),this.source?this.gl.texImage2D(this.gl.TEXTURE_2D,0,this._globalParameters.internalFormat,this._globalParameters.format,this._globalParameters.type,this.source):this.sourceType==="fbo"&&this.gl.texImage2D(this.gl.TEXTURE_2D,0,this._globalParameters.internalFormat,this._size.width,this._size.height,0,this._globalParameters.format,this._globalParameters.type,this.source||null),this._uploaded||(this.renderer.nextRender.add(()=>this._onSourceUploadedCallback&&this._onSourceUploadedCallback()),this._uploaded=!0)}_getSizes(){if(this.sourceType==="fbo")return{parentWidth:this._parent._boundingRect.document.width,parentHeight:this._parent._boundingRect.document.height,sourceWidth:this._parent._boundingRect.document.width,sourceHeight:this._parent._boundingRect.document.height,xOffset:0,yOffset:0};const e=this._parent.scale?me.set(this._parent.scale.x,this._parent.scale.y):me.set(1,1),t=this._parent._boundingRect.document.width*e.x,i=this._parent._boundingRect.document.height*e.y,s=this._size.width,r=this._size.height,a=s/r,o=t/i;let l=0,h=0;return o>a?h=Math.min(0,i-t*(1/a)):o<a&&(l=Math.min(0,t-i*a)),{parentWidth:t,parentHeight:i,sourceWidth:s,sourceHeight:r,xOffset:l,yOffset:h}}setScale(e){if(!e.type||e.type!=="Vec2"){this.renderer.production||p(this.type+": Cannot set scale because the parameter passed is not of Vec2 type:",e);return}e.sanitizeNaNValuesWith(this.scale).max(me.set(.001,.001)),e.equals(this.scale)||(this.scale.copy(e),this.resize())}setOffset(e){if(!e.type||e.type!=="Vec2"){this.renderer.production||p(this.type+": Cannot set offset because the parameter passed is not of Vec2 type:",scale);return}e.sanitizeNaNValuesWith(this.offset),e.equals(this.offset)||(this.offset.copy(e),this.resize())}_setSize(){if(this._parent&&this._parent._program){const e=this._getSizes();this._updateTextureMatrix(e)}}resize(){this.sourceType==="fbo"?(this._size={width:this._parent._size&&this._parent._size.width||this._parent._boundingRect.document.width,height:this._parent._size&&this._parent._size.height||this._parent._boundingRect.document.height},this._copiedFrom||(this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this._globalParameters.internalFormat,this._size.width,this._size.height,0,this._globalParameters.format,this._globalParameters.type,null))):this.source&&(this._size={width:this.source.naturalWidth||this.source.width||this.source.videoWidth,height:this.source.naturalHeight||this.source.height||this.source.videoHeight}),this._setSize()}_updateTextureMatrix(e){const t=et.set(e.parentWidth/(e.parentWidth-e.xOffset),e.parentHeight/(e.parentHeight-e.yOffset),1);t.x/=this.scale.x,t.y/=this.scale.y,this._textureMatrix.matrix=tt.setFromArray([t.x,0,0,0,0,t.y,0,0,0,0,1,0,(1-t.x)/2+this.offset.x,(1-t.y)/2+this.offset.y,0,1]),this._updateMatrixUniform()}_updateMatrixUniform(){this._textureMatrix.isActive&&(this.renderer.useProgram(this._parent._program),this.gl.uniformMatrix4fv(this._textureMatrix.location,!1,this._textureMatrix.matrix.elements))}_onSourceLoaded(e){this.setSource(e),this.sourceType==="image"&&this.renderer.cache.addTexture(this)}_bindTexture(){this._canDraw&&(this.renderer.state.activeTexture!==this.index&&(this.gl.activeTexture(this.gl.TEXTURE0+this.index),this.renderer.state.activeTexture=this.index),this.gl.bindTexture(this.gl.TEXTURE_2D,this._sampler.texture),this._sampler.isTextureBound||(this._sampler.isTextureBound=!!this.gl.getParameter(this.gl.TEXTURE_BINDING_2D),this._sampler.isTextureBound&&this.renderer.needRender()))}_draw(){this._sampler.isActive&&(this._bindTexture(),this.sourceType==="video"&&this.source&&!this._videoFrameCallbackID&&this.source.readyState>=this.source.HAVE_CURRENT_DATA&&!this.source.paused&&(this._willUpdate=!0),(this._forceUpdate||this._willUpdate&&this.shouldUpdate)&&(this._state.generateMipmap=!1,this._upload()),this.sourceType==="video"&&(this._willUpdate=!1),this._forceUpdate=!1),this.parameters._shouldUpdate&&(this._updateTexParameters(),this.parameters._shouldUpdate=!1)}onSourceLoaded(e){return e&&(this._onSourceLoadedCallback=e),this}onSourceUploaded(e){return e&&(this._onSourceUploadedCallback=e),this}_dispose(e=!1){this.sourceType==="video"||this.sourceType==="image"&&!this.renderer.state.isActive?(this._loader&&this._loader._removeSource(this),this.source=null):this.sourceType==="canvas"&&(this.source.width=this.source.width,this.source=null),this._parent=null,this.gl&&!this._copiedFrom&&(e||this.sourceType!=="image"||!this.renderer.state.isActive)&&(this._canDraw=!1,this.renderer.cache.removeTexture(this),this.gl.activeTexture(this.gl.TEXTURE0+this.index),this.gl.bindTexture(this.gl.TEXTURE_2D,null),this.gl.deleteTexture(this._sampler.texture))}}class it{constructor(e,t="anonymous"){if(this.type="TextureLoader",e=e&&e.renderer||e,!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){z(this.type+": Renderer WebGL context is undefined",e);return}this.renderer=e,this.gl=this.renderer.gl,this.crossOrigin=t,this.elements=[]}_addElement(e,t,i,s){const r={source:e,texture:t,load:this._sourceLoaded.bind(this,e,t,i),error:this._sourceLoadError.bind(this,e,s)};return this.elements.push(r),r}_sourceLoadError(e,t,i){t&&t(e,i)}_sourceLoaded(e,t,i){t._sourceLoaded||(t._onSourceLoaded(e),this._parent&&(this._increment&&this._increment(),this.renderer.nextRender.add(()=>this._parent._onLoadingCallback&&this._parent._onLoadingCallback(t))),i&&i(t))}_getSourceType(e){let t;return typeof e=="string"?e.match(/\.(jpeg|jpg|jfif|pjpeg|pjp|gif|bmp|png|webp|svg|avif|apng)$/)!==null?t="image":e.match(/\.(webm|mp4|mpg|mpeg|avi|ogg|ogm|ogv|mov|av1)$/)!==null&&(t="video"):e.tagName.toUpperCase()==="IMG"?t="image":e.tagName.toUpperCase()==="VIDEO"?t="video":e.tagName.toUpperCase()==="CANVAS"&&(t="canvas"),t}_createImage(e){if(typeof e=="string"||!e.hasAttribute("crossOrigin")){const t=new Image;return t.crossOrigin=this.crossOrigin,typeof e=="string"?t.src=e:(t.src=e.src,e.hasAttribute("data-sampler")&&t.setAttribute("data-sampler",e.getAttribute("data-sampler"))),t}else return e}_createVideo(e){if(typeof e=="string"||e.getAttribute("crossOrigin")===null){const t=document.createElement("video");return t.crossOrigin=this.crossOrigin,typeof e=="string"?t.src=e:(t.src=e.src,e.hasAttribute("data-sampler")&&t.setAttribute("data-sampler",e.getAttribute("data-sampler"))),t}else return e}loadSource(e,t,i,s){switch(this._getSourceType(e)){case"image":this.loadImage(e,t,i,s);break;case"video":this.loadVideo(e,t,i,s);break;case"canvas":this.loadCanvas(e,t,i);break;default:this._sourceLoadError(e,s,"this source could not be converted into a texture: "+e);break}}loadSources(e,t,i,s){for(let r=0;r<e.length;r++)this.loadSource(e[r],t,i,s)}loadImage(e,t={},i,s){const r=this.renderer.cache.getTextureFromSource(e);let a=Object.assign({},t);if(this._parent&&(a=Object.assign(a,this._parent._texturesOptions)),a.loader=this,r){a.sampler=typeof e!="string"&&e.hasAttribute("data-sampler")?e.getAttribute("data-sampler"):a.sampler,a.fromTexture=r;const c=new ee(this.renderer,a);this._sourceLoaded(r.source,c,i),this._parent&&this._addToParent(c,r.source,"image");return}const o=this._createImage(e);a.sampler=o.hasAttribute("data-sampler")?o.getAttribute("data-sampler"):a.sampler;const l=new ee(this.renderer,a),h=this._addElement(o,l,i,s);o.complete?this._sourceLoaded(o,l,i):o.decode?o.decode().then(this._sourceLoaded.bind(this,o,l,i)).catch(()=>{o.addEventListener("load",h.load,!1),o.addEventListener("error",h.error,!1)}):(o.addEventListener("load",h.load,!1),o.addEventListener("error",h.error,!1)),this._parent&&this._addToParent(l,o,"image")}loadImages(e,t,i,s){for(let r=0;r<e.length;r++)this.loadImage(e[r],t,i,s)}loadVideo(e,t={},i,s){const r=this._createVideo(e);r.preload=!0,r.muted=!0,r.loop=!0,r.setAttribute("playsinline",""),r.crossOrigin=this.crossOrigin;let a=Object.assign({},t);this._parent&&(a=Object.assign(t,this._parent._texturesOptions)),a.loader=this,a.sampler=r.hasAttribute("data-sampler")?r.getAttribute("data-sampler"):a.sampler;const o=new ee(this.renderer,a),l=this._addElement(r,o,i,s);r.addEventListener("canplaythrough",l.load,!1),r.addEventListener("error",l.error,!1),r.readyState>=r.HAVE_FUTURE_DATA&&i&&this._sourceLoaded(r,o,i),r.load(),this._addToParent&&this._addToParent(o,r,"video"),"requestVideoFrameCallback"in HTMLVideoElement.prototype&&(l.videoFrameCallback=o._videoFrameCallback.bind(o),o._videoFrameCallbackID=r.requestVideoFrameCallback(l.videoFrameCallback))}loadVideos(e,t,i,s){for(let r=0;r<e.length;r++)this.loadVideo(e[r],t,i,s)}loadCanvas(e,t={},i){let s=Object.assign({},t);this._parent&&(s=Object.assign(t,this._parent._texturesOptions)),s.loader=this,s.sampler=e.hasAttribute("data-sampler")?e.getAttribute("data-sampler"):s.sampler;const r=new ee(this.renderer,s);this._addElement(e,r,i,null),this._sourceLoaded(e,r,i),this._parent&&this._addToParent(r,e,"canvas")}loadCanvases(e,t,i){for(let s=0;s<e.length;s++)this.loadCanvas(e[s],t,i)}_removeSource(e){const t=this.elements.find(i=>i.texture.uuid===e.uuid);t&&(e.sourceType==="image"?t.source.removeEventListener("load",t.load,!1):e.sourceType==="video"&&(t.videoFrameCallback&&e._videoFrameCallbackID&&t.source.cancelVideoFrameCallback(e._videoFrameCallbackID),t.source.removeEventListener("canplaythrough",t.load,!1),t.source.pause(),t.source.removeAttribute("src"),t.source.load()),t.source.removeEventListener("error",t.error,!1))}}class st extends it{constructor(e,t,{sourcesLoaded:i=0,sourcesToLoad:s=0,complete:r=!1,onComplete:a=()=>{}}={}){super(e,t.crossOrigin),this.type="PlaneTextureLoader",this._parent=t,this._parent.type!=="Plane"&&this._parent.type!=="PingPongPlane"&&this._parent.type!=="ShaderPass"&&(p(this.type+": Wrong parent type assigned to this loader"),this._parent=null),this.sourcesLoaded=i,this.sourcesToLoad=s,this.complete=r,this.onComplete=a}_setLoaderSize(e){this.sourcesToLoad=e,this.sourcesToLoad===0&&(this.complete=!0,this.renderer.nextRender.add(()=>this.onComplete&&this.onComplete()))}_increment(){this.sourcesLoaded++,this.sourcesLoaded>=this.sourcesToLoad&&!this.complete&&(this.complete=!0,this.renderer.nextRender.add(()=>this.onComplete&&this.onComplete()))}_addSourceToParent(e,t){if(t==="image"){const i=this._parent.images;!i.find(r=>r.src===e.src)&&i.push(e)}else if(t==="video"){const i=this._parent.videos;!i.find(r=>r.src===e.src)&&i.push(e)}else if(t==="canvas"){const i=this._parent.canvases;!i.find(r=>r.isSameNode(e))&&i.push(e)}}_addToParent(e,t,i){this._addSourceToParent(t,i),this._parent&&e.addParent(this._parent)}}class rt{constructor(e,t="Mesh",{vertexShaderID:i,fragmentShaderID:s,vertexShader:r,fragmentShader:a,uniforms:o={},widthSegments:l=1,heightSegments:h=1,renderOrder:c=0,depthTest:u=!0,cullFace:d="back",texturesOptions:f={},crossOrigin:_="anonymous"}={}){if(this.type=t,e=e&&e.renderer||e,(!e||e.type!=="Renderer")&&(z(this.type+": Curtains not passed as first argument or Curtains Renderer is missing",e),setTimeout(()=>{this._onErrorCallback&&this._onErrorCallback()},0)),this.renderer=e,this.gl=this.renderer.gl,!this.gl){this.renderer.production||z(this.type+": Unable to create a "+this.type+" because the Renderer WebGL context is not defined"),setTimeout(()=>{this._onErrorCallback&&this._onErrorCallback()},0);return}this._canDraw=!1,this.renderOrder=c,this._depthTest=u,this.cullFace=d,this.cullFace!=="back"&&this.cullFace!=="front"&&this.cullFace!=="none"&&(this.cullFace="back"),this.textures=[],this._texturesOptions=Object.assign({premultiplyAlpha:!1,anisotropy:1,floatingPoint:"none",wrapS:this.gl.CLAMP_TO_EDGE,wrapT:this.gl.CLAMP_TO_EDGE,minFilter:this.gl.LINEAR,magFilter:this.gl.LINEAR},f),this.crossOrigin=_,!r&&i&&document.getElementById(i)&&(r=document.getElementById(i).innerHTML),!a&&s&&document.getElementById(s)&&(a=document.getElementById(s).innerHTML),this._initMesh(),l=parseInt(l),h=parseInt(h),this._geometry=new Je(this.renderer,{width:l,height:h}),this._program=new _e(this.renderer,{parent:this,vertexShader:r,fragmentShader:a}),this._program.compiled?(this._program.createUniforms(o),this.uniforms=this._program.uniformsManager.uniforms,this._geometry.setProgram(this._program),this.renderer.onSceneChange()):this.renderer.nextRender.add(()=>this._onErrorCallback&&this._onErrorCallback())}_initMesh(){this.uuid=pe(),this.loader=new st(this.renderer,this,{sourcesLoaded:0,initSourcesToLoad:0,complete:!1,onComplete:()=>{this._onReadyCallback&&this._onReadyCallback(),this.renderer.needRender()}}),this.images=[],this.videos=[],this.canvases=[],this.userData={},this._canDraw=!0}_restoreContext(){this._canDraw=!1,this._matrices&&(this._matrices=null),this._program=new _e(this.renderer,{parent:this,vertexShader:this._program.vsCode,fragmentShader:this._program.fsCode}),this._program.compiled&&(this._geometry.restoreContext(this._program),this._program.createUniforms(this.uniforms),this.uniforms=this._program.uniformsManager.uniforms,this._programRestored())}setRenderTarget(e){if(!e||e.type!=="RenderTarget"){this.renderer.production||p(this.type+": Could not set the render target because the argument passed is not a RenderTarget class object",e);return}this.type==="Plane"&&this.renderer.scene.removePlane(this),this.target=e,this.type==="Plane"&&this.renderer.scene.addPlane(this)}setRenderOrder(e=0){e=isNaN(e)?this.renderOrder:parseInt(e),e!==this.renderOrder&&(this.renderOrder=e,this.renderer.scene.setPlaneRenderOrder(this))}createTexture(e={}){const t=new ee(this.renderer,Object.assign(e,this._texturesOptions));return t.addParent(this),t}addTexture(e){if(!e||e.type!=="Texture"){this.renderer.production||p(this.type+": cannot add ",e," to this "+this.type+" because it is not a valid texture");return}e.addParent(this)}loadSources(e,t={},i,s){for(let r=0;r<e.length;r++)this.loadSource(e[r],t,i,s)}loadSource(e,t={},i,s){this.loader.loadSource(e,Object.assign(t,this._texturesOptions),r=>{i&&i(r)},(r,a)=>{this.renderer.production||p(this.type+": this HTML tag could not be converted into a texture:",r.tagName),s&&s(r,a)})}loadImage(e,t={},i,s){this.loader.loadImage(e,Object.assign(t,this._texturesOptions),r=>{i&&i(r)},(r,a)=>{this.renderer.production||p(this.type+`: There has been an error:
`,a,`
while loading this image:
`,r),s&&s(r,a)})}loadVideo(e,t={},i,s){this.loader.loadVideo(e,Object.assign(t,this._texturesOptions),r=>{i&&i(r)},(r,a)=>{this.renderer.production||p(this.type+`: There has been an error:
`,a,`
while loading this video:
`,r),s&&s(r,a)})}loadCanvas(e,t={},i){this.loader.loadCanvas(e,Object.assign(t,this._texturesOptions),s=>{i&&i(s)})}loadImages(e,t={},i,s){for(let r=0;r<e.length;r++)this.loadImage(e[r],t,i,s)}loadVideos(e,t={},i,s){for(let r=0;r<e.length;r++)this.loadVideo(e[r],t,i,s)}loadCanvases(e,t={},i){for(let s=0;s<e.length;s++)this.loadCanvas(e[s],t,i)}playVideos(){for(let e=0;e<this.textures.length;e++){const t=this.textures[e];if(t.sourceType==="video"){const i=t.source.play();i!==void 0&&i.catch(s=>{this.renderer.production||p(this.type+": Could not play the video : ",s)})}}}_draw(){this.renderer.setDepthTest(this._depthTest),this.renderer.setFaceCulling(this.cullFace),this._program.updateUniforms(),this._geometry.bindBuffers(),this.renderer.state.forceBufferUpdate=!1;for(let e=0;e<this.textures.length;e++)if(this.textures[e]._draw(),this.textures[e]._sampler.isActive&&!this.textures[e]._sampler.isTextureBound)return;this._geometry.draw(),this.renderer.state.activeTexture=null,this._onAfterRenderCallback&&this._onAfterRenderCallback()}onError(e){return e&&(this._onErrorCallback=e),this}onLoading(e){return e&&(this._onLoadingCallback=e),this}onReady(e){return e&&(this._onReadyCallback=e),this}onRender(e){return e&&(this._onRenderCallback=e),this}onAfterRender(e){return e&&(this._onAfterRenderCallback=e),this}remove(){this._canDraw=!1,this.target&&this.renderer.bindFrameBuffer(null),this._dispose(),this.type==="Plane"?this.renderer.removePlane(this):this.type==="ShaderPass"&&(this.target&&(this.target._shaderPass=null,this.target.remove(),this.target=null),this.renderer.removeShaderPass(this))}_dispose(){if(this.gl){this._geometry&&this._geometry.dispose(),this.target&&this.type==="ShaderPass"&&(this.renderer.removeRenderTarget(this.target),this.textures.shift());for(let e=0;e<this.textures.length;e++)this.textures[e]._dispose();this.textures=[]}}}const ye=new T,at=new T;class nt extends rt{constructor(e,t,i="DOMMesh",{widthSegments:s,heightSegments:r,renderOrder:a,depthTest:o,cullFace:l,uniforms:h,vertexShaderID:c,fragmentShaderID:u,vertexShader:d,fragmentShader:f,texturesOptions:_,crossOrigin:x}={}){c=c||t&&t.getAttribute("data-vs-id"),u=u||t&&t.getAttribute("data-fs-id"),super(e,i,{widthSegments:s,heightSegments:r,renderOrder:a,depthTest:o,cullFace:l,uniforms:h,vertexShaderID:c,fragmentShaderID:u,vertexShader:d,fragmentShader:f,texturesOptions:_,crossOrigin:x}),this.gl&&(this.htmlElement=t,(!this.htmlElement||this.htmlElement.length===0)&&(this.renderer.production||p(this.type+": The HTML element you specified does not currently exists in the DOM")),this._setDocumentSizes())}_setDocumentSizes(){let e=this.htmlElement.getBoundingClientRect();this._boundingRect||(this._boundingRect={}),this._boundingRect.document={width:e.width*this.renderer.pixelRatio,height:e.height*this.renderer.pixelRatio,top:e.top*this.renderer.pixelRatio,left:e.left*this.renderer.pixelRatio}}getBoundingRect(){return{width:this._boundingRect.document.width,height:this._boundingRect.document.height,top:this._boundingRect.document.top,left:this._boundingRect.document.left,right:this._boundingRect.document.left+this._boundingRect.document.width,bottom:this._boundingRect.document.top+this._boundingRect.document.height}}resize(){this._setDocumentSizes(),this.type==="Plane"&&(this.setPerspective(this.camera.fov,this.camera.near,this.camera.far),this._setWorldSizes(),this._applyWorldPositions());for(let e=0;e<this.textures.length;e++)this.textures[e].resize();this.renderer.nextRender.add(()=>this._onAfterResizeCallback&&this._onAfterResizeCallback())}mouseToPlaneCoords(e){const t=this.scale?this.scale:at.set(1,1),i=ye.set((this._boundingRect.document.width-this._boundingRect.document.width*t.x)/2,(this._boundingRect.document.height-this._boundingRect.document.height*t.y)/2),s={width:this._boundingRect.document.width*t.x/this.renderer.pixelRatio,height:this._boundingRect.document.height*t.y/this.renderer.pixelRatio,top:(this._boundingRect.document.top+i.y)/this.renderer.pixelRatio,left:(this._boundingRect.document.left+i.x)/this.renderer.pixelRatio};return ye.set((e.x-s.left)/s.width*2-1,1-(e.y-s.top)/s.height*2)}onAfterResize(e){return e&&(this._onAfterResizeCallback=e),this}}class ot{constructor({fov:e=50,near:t=.1,far:i=150,width:s,height:r,pixelRatio:a=1}={}){this.position=new A,this.projectionMatrix=new H,this.worldMatrix=new H,this.viewMatrix=new H,this._shouldUpdate=!1,this.setSize(),this.setPerspective(e,t,i,s,r,a)}setFov(e){e=isNaN(e)?this.fov:parseFloat(e),e=Math.max(1,Math.min(e,179)),e!==this.fov&&(this.fov=e,this.setPosition(),this._shouldUpdate=!0),this.setCSSPerspective()}setNear(e){e=isNaN(e)?this.near:parseFloat(e),e=Math.max(e,.01),e!==this.near&&(this.near=e,this._shouldUpdate=!0)}setFar(e){e=isNaN(e)?this.far:parseFloat(e),e=Math.max(e,50),e!==this.far&&(this.far=e,this._shouldUpdate=!0)}setPixelRatio(e){e!==this.pixelRatio&&(this._shouldUpdate=!0),this.pixelRatio=e}setSize(e,t){(e!==this.width||t!==this.height)&&(this._shouldUpdate=!0),this.width=e,this.height=t}setPerspective(e,t,i,s,r,a){this.setPixelRatio(a),this.setSize(s,r),this.setFov(e),this.setNear(t),this.setFar(i),this._shouldUpdate&&this.updateProjectionMatrix()}setPosition(){this.position.set(0,0,1),this.worldMatrix.setFromArray([1,0,0,0,0,1,0,0,0,0,1,0,this.position.x,this.position.y,this.position.z,1]),this.viewMatrix=this.viewMatrix.copy(this.worldMatrix).getInverse()}setCSSPerspective(){this.CSSPerspective=Math.pow(Math.pow(this.width/(2*this.pixelRatio),2)+Math.pow(this.height/(2*this.pixelRatio),2),.5)/Math.tan(this.fov*.5*Math.PI/180)}getScreenRatiosFromFov(e=0){const t=this.position.z;e<t?e-=t:e+=t;const i=this.fov*Math.PI/180,s=2*Math.tan(i/2)*Math.abs(e);return{width:s*this.width/this.height,height:s}}updateProjectionMatrix(){const e=this.width/this.height,t=this.near*Math.tan(Math.PI/180*.5*this.fov),i=2*t,s=e*i,r=-.5*s,a=r+s,o=t-i,l=2*this.near/(a-r),h=2*this.near/(t-o),c=(a+r)/(a-r),u=(t+o)/(t-o),d=-(this.far+this.near)/(this.far-this.near),f=-2*this.far*this.near/(this.far-this.near);this.projectionMatrix.setFromArray([l,0,0,0,0,h,0,0,c,u,d,-1,0,0,f,0])}forceUpdate(){this._shouldUpdate=!0}cancelUpdate(){this._shouldUpdate=!1}}class oe{constructor(e=new Float32Array([0,0,0,1]),t="XYZ"){this.type="Quat",this.elements=e,this.axisOrder=t}setFromArray(e){return this.elements[0]=e[0],this.elements[1]=e[1],this.elements[2]=e[2],this.elements[3]=e[3],this}setAxisOrder(e){switch(e=e.toUpperCase(),e){case"XYZ":case"YXZ":case"ZXY":case"ZYX":case"YZX":case"XZY":this.axisOrder=e;break;default:this.axisOrder="XYZ"}return this}copy(e){return this.elements=e.elements,this.axisOrder=e.axisOrder,this}clone(){return new oe().copy(this)}equals(e){return this.elements[0]===e.elements[0]&&this.elements[1]===e.elements[1]&&this.elements[2]===e.elements[2]&&this.elements[3]===e.elements[3]&&this.axisOrder===e.axisOrder}setFromVec3(e){const t=e.x*.5,i=e.y*.5,s=e.z*.5,r=Math.cos(t),a=Math.cos(i),o=Math.cos(s),l=Math.sin(t),h=Math.sin(i),c=Math.sin(s);return this.axisOrder==="XYZ"?(this.elements[0]=l*a*o+r*h*c,this.elements[1]=r*h*o-l*a*c,this.elements[2]=r*a*c+l*h*o,this.elements[3]=r*a*o-l*h*c):this.axisOrder==="YXZ"?(this.elements[0]=l*a*o+r*h*c,this.elements[1]=r*h*o-l*a*c,this.elements[2]=r*a*c-l*h*o,this.elements[3]=r*a*o+l*h*c):this.axisOrder==="ZXY"?(this.elements[0]=l*a*o-r*h*c,this.elements[1]=r*h*o+l*a*c,this.elements[2]=r*a*c+l*h*o,this.elements[3]=r*a*o-l*h*c):this.axisOrder==="ZYX"?(this.elements[0]=l*a*o-r*h*c,this.elements[1]=r*h*o+l*a*c,this.elements[2]=r*a*c-l*h*o,this.elements[3]=r*a*o+l*h*c):this.axisOrder==="YZX"?(this.elements[0]=l*a*o+r*h*c,this.elements[1]=r*h*o+l*a*c,this.elements[2]=r*a*c-l*h*o,this.elements[3]=r*a*o-l*h*c):this.axisOrder==="XZY"&&(this.elements[0]=l*a*o-r*h*c,this.elements[1]=r*h*o-l*a*c,this.elements[2]=r*a*c+l*h*o,this.elements[3]=r*a*o+l*h*c),this}}const lt=new T,ht=new A,ct=new A,ut=new A,dt=new A,ft=new A,pt=new A,U=new A,V=new A,Pe=new oe,mt=new A(.5,.5,0),gt=new A,xt=new A,vt=new A,_t=new A,yt=new T;class be extends nt{constructor(e,t,{widthSegments:i,heightSegments:s,renderOrder:r,depthTest:a,cullFace:o,uniforms:l,vertexShaderID:h,fragmentShaderID:c,vertexShader:u,fragmentShader:d,texturesOptions:f,crossOrigin:_,alwaysDraw:x=!1,visible:P=!0,transparent:v=!1,drawCheckMargins:m={top:0,right:0,bottom:0,left:0},autoloadSources:g=!0,watchScroll:b=!0,fov:R=50}={}){super(e,t,"Plane",{widthSegments:i,heightSegments:s,renderOrder:r,depthTest:a,cullFace:o,uniforms:l,vertexShaderID:h,fragmentShaderID:c,vertexShader:u,fragmentShader:d,texturesOptions:f,crossOrigin:_}),this.gl&&(this.index=this.renderer.planes.length,this.target=null,this.alwaysDraw=x,this._shouldDraw=!0,this.visible=P,this._transparent=v,this.drawCheckMargins=m,this.autoloadSources=g,this.watchScroll=b,this._updateMVMatrix=!1,this.camera=new ot({fov:R,width:this.renderer._boundingRect.width,height:this.renderer._boundingRect.height,pixelRatio:this.renderer.pixelRatio}),this._program.compiled&&(this._initPlane(),this.renderer.scene.addPlane(this),this.renderer.planes.push(this)))}_programRestored(){this.target&&this.setRenderTarget(this.renderer.renderTargets[this.target.index]),this._initMatrices(),this.setPerspective(this.camera.fov,this.camera.near,this.camera.far),this._setWorldSizes(),this._applyWorldPositions(),this.renderer.scene.addPlane(this);for(let e=0;e<this.textures.length;e++)this.textures[e]._parent=this,this.textures[e]._restoreContext();this._canDraw=!0}_initPlane(){this._initTransformValues(),this._initPositions(),this.setPerspective(this.camera.fov,this.camera.near,this.camera.far),this._initSources()}_initTransformValues(){this.rotation=new A,this.rotation.onChange(()=>this._applyRotation()),this.quaternion=new oe,this.relativeTranslation=new A,this.relativeTranslation.onChange(()=>this._setTranslation()),this._translation=new A,this.scale=new A(1),this.scale.onChange(()=>{this.scale.z=1,this._applyScale()}),this.transformOrigin=new A(.5,.5,0),this.transformOrigin.onChange(()=>{this._setWorldTransformOrigin(),this._updateMVMatrix=!0})}resetPlane(e){this._initTransformValues(),this._setWorldTransformOrigin(),e!==null&&e?(this.htmlElement=e,this.resize()):!e&&!this.renderer.production&&p(this.type+": You are trying to reset a plane with a HTML element that does not exist. The old HTML element will be kept instead.")}removeRenderTarget(){this.target&&(this.renderer.scene.removePlane(this),this.target=null,this.renderer.scene.addPlane(this))}_initPositions(){this._initMatrices(),this._setWorldSizes(),this._applyWorldPositions()}_initMatrices(){const e=new H;this._matrices={world:{matrix:e},modelView:{name:"uMVMatrix",matrix:e,location:this.gl.getUniformLocation(this._program.program,"uMVMatrix")},projection:{name:"uPMatrix",matrix:e,location:this.gl.getUniformLocation(this._program.program,"uPMatrix")},modelViewProjection:{matrix:e}}}_setPerspectiveMatrix(){this.camera._shouldUpdate&&(this.renderer.useProgram(this._program),this.gl.uniformMatrix4fv(this._matrices.projection.location,!1,this._matrices.projection.matrix.elements)),this.camera.cancelUpdate()}setPerspective(e,t,i){this.camera.setPerspective(e,t,i,this.renderer._boundingRect.width,this.renderer._boundingRect.height,this.renderer.pixelRatio),this.renderer.state.isContextLost&&this.camera.forceUpdate(),this._matrices.projection.matrix=this.camera.projectionMatrix,this.camera._shouldUpdate&&(this._setWorldSizes(),this._applyWorldPositions(),this._translation.z=this.relativeTranslation.z/this.camera.CSSPerspective),this._updateMVMatrix=this.camera._shouldUpdate}_setMVMatrix(){this._updateMVMatrix&&(this._matrices.world.matrix=this._matrices.world.matrix.composeFromOrigin(this._translation,this.quaternion,this.scale,this._boundingRect.world.transformOrigin),this._matrices.world.matrix.scale({x:this._boundingRect.world.width,y:this._boundingRect.world.height,z:1}),this._matrices.modelView.matrix.copy(this._matrices.world.matrix),this._matrices.modelView.matrix.elements[14]-=this.camera.position.z,this._matrices.modelViewProjection.matrix=this._matrices.projection.matrix.multiply(this._matrices.modelView.matrix),this.alwaysDraw||this._shouldDrawCheck(),this.renderer.useProgram(this._program),this.gl.uniformMatrix4fv(this._matrices.modelView.location,!1,this._matrices.modelView.matrix.elements)),this._updateMVMatrix=!1}_setWorldTransformOrigin(){this._boundingRect.world.transformOrigin=new A((this.transformOrigin.x*2-1)*this._boundingRect.world.width,-(this.transformOrigin.y*2-1)*this._boundingRect.world.height,this.transformOrigin.z)}_documentToWorldSpace(e){return ct.set(e.x*this.renderer.pixelRatio/this.renderer._boundingRect.width*this._boundingRect.world.ratios.width,-(e.y*this.renderer.pixelRatio/this.renderer._boundingRect.height)*this._boundingRect.world.ratios.height,e.z)}_setWorldSizes(){const e=this.camera.getScreenRatiosFromFov();this._boundingRect.world={width:this._boundingRect.document.width/this.renderer._boundingRect.width*e.width/2,height:this._boundingRect.document.height/this.renderer._boundingRect.height*e.height/2,ratios:e},this._setWorldTransformOrigin()}_setWorldPosition(){const e={x:this._boundingRect.document.width/2+this._boundingRect.document.left,y:this._boundingRect.document.height/2+this._boundingRect.document.top},t={x:this.renderer._boundingRect.width/2+this.renderer._boundingRect.left,y:this.renderer._boundingRect.height/2+this.renderer._boundingRect.top};this._boundingRect.world.top=(t.y-e.y)/this.renderer._boundingRect.height*this._boundingRect.world.ratios.height,this._boundingRect.world.left=(e.x-t.x)/this.renderer._boundingRect.width*this._boundingRect.world.ratios.width}setScale(e){if(!e.type||e.type!=="Vec2"){this.renderer.production||p(this.type+": Cannot set scale because the parameter passed is not of Vec2 type:",e);return}e.sanitizeNaNValuesWith(this.scale).max(lt.set(.001,.001)),(e.x!==this.scale.x||e.y!==this.scale.y)&&(this.scale.set(e.x,e.y,1),this._applyScale())}_applyScale(){for(let e=0;e<this.textures.length;e++)this.textures[e].resize();this._updateMVMatrix=!0}setRotation(e){if(!e.type||e.type!=="Vec3"){this.renderer.production||p(this.type+": Cannot set rotation because the parameter passed is not of Vec3 type:",e);return}e.sanitizeNaNValuesWith(this.rotation),e.equals(this.rotation)||(this.rotation.copy(e),this._applyRotation())}_applyRotation(){this.quaternion.setFromVec3(this.rotation),this._updateMVMatrix=!0}setTransformOrigin(e){if(!e.type||e.type!=="Vec3"){this.renderer.production||p(this.type+": Cannot set transform origin because the parameter passed is not of Vec3 type:",e);return}e.sanitizeNaNValuesWith(this.transformOrigin),e.equals(this.transformOrigin)||(this.transformOrigin.copy(e),this._setWorldTransformOrigin(),this._updateMVMatrix=!0)}_setTranslation(){let e=ht.set(0,0,0);this.relativeTranslation.equals(e)||(e=this._documentToWorldSpace(this.relativeTranslation)),this._translation.set(this._boundingRect.world.left+e.x,this._boundingRect.world.top+e.y,this.relativeTranslation.z/this.camera.CSSPerspective),this._updateMVMatrix=!0}setRelativeTranslation(e){if(!e.type||e.type!=="Vec3"){this.renderer.production||p(this.type+": Cannot set translation because the parameter passed is not of Vec3 type:",e);return}e.sanitizeNaNValuesWith(this.relativeTranslation),e.equals(this.relativeTranslation)||(this.relativeTranslation.copy(e),this._setTranslation())}_applyWorldPositions(){this._setWorldPosition(),this._setTranslation()}updatePosition(){this._setDocumentSizes(),this._applyWorldPositions()}updateScrollPosition(e,t){(e||t)&&(this._boundingRect.document.top+=t*this.renderer.pixelRatio,this._boundingRect.document.left+=e*this.renderer.pixelRatio,this._applyWorldPositions())}_getIntersection(e,t){let i=t.clone().sub(e),s=e.clone();for(;s.z>-1;)s.add(i);return s}_getNearPlaneIntersections(e,t,i){const s=this._matrices.modelViewProjection.matrix;if(i.length===1)i[0]===0?(t[0]=this._getIntersection(t[1],U.set(.95,1,0).applyMat4(s)),t.push(this._getIntersection(t[3],V.set(-1,-.95,0).applyMat4(s)))):i[0]===1?(t[1]=this._getIntersection(t[0],U.set(-.95,1,0).applyMat4(s)),t.push(this._getIntersection(t[2],V.set(1,-.95,0).applyMat4(s)))):i[0]===2?(t[2]=this._getIntersection(t[3],U.set(-.95,-1,0).applyMat4(s)),t.push(this._getIntersection(t[1],V.set(1,.95,0).applyMat4(s)))):i[0]===3&&(t[3]=this._getIntersection(t[2],U.set(.95,-1,0).applyMat4(s)),t.push(this._getIntersection(t[0],V.set(-1,.95,0).applyMat4(s))));else if(i.length===2)i[0]===0&&i[1]===1?(t[0]=this._getIntersection(t[3],U.set(-1,-.95,0).applyMat4(s)),t[1]=this._getIntersection(t[2],V.set(1,-.95,0).applyMat4(s))):i[0]===1&&i[1]===2?(t[1]=this._getIntersection(t[0],U.set(-.95,1,0).applyMat4(s)),t[2]=this._getIntersection(t[3],V.set(-.95,-1,0).applyMat4(s))):i[0]===2&&i[1]===3?(t[2]=this._getIntersection(t[1],U.set(1,.95,0).applyMat4(s)),t[3]=this._getIntersection(t[0],V.set(-1,.95,0).applyMat4(s))):i[0]===0&&i[1]===3&&(t[0]=this._getIntersection(t[1],U.set(.95,1,0).applyMat4(s)),t[3]=this._getIntersection(t[2],V.set(.95,-1,0).applyMat4(s)));else if(i.length===3){let r=0;for(let a=0;a<e.length;a++)i.includes(a)||(r=a);t=[t[r]],r===0?(t.push(this._getIntersection(t[0],U.set(-.95,1,0).applyMat4(s))),t.push(this._getIntersection(t[0],V.set(-1,.95,0).applyMat4(s)))):r===1?(t.push(this._getIntersection(t[0],U.set(.95,1,0).applyMat4(s))),t.push(this._getIntersection(t[0],V.set(1,.95,0).applyMat4(s)))):r===2?(t.push(this._getIntersection(t[0],U.set(.95,-1,0).applyMat4(s))),t.push(this._getIntersection(t[0],V.set(1,-.95,0).applyMat4(s)))):r===3&&(t.push(this._getIntersection(t[0],U.set(-.95,-1,0).applyMat4(s))),t.push(this._getIntersection(t[0],V.set(-1-.95,0).applyMat4(s))))}else for(let r=0;r<e.length;r++)t[r][0]=1e4,t[r][1]=1e4;return t}_getWorldCoords(){const e=[ut.set(-1,1,0),dt.set(1,1,0),ft.set(1,-1,0),pt.set(-1,-1,0)];let t=[],i=[];for(let l=0;l<e.length;l++){const h=e[l].applyMat4(this._matrices.modelViewProjection.matrix);t.push(h),Math.abs(h.z)>1&&i.push(l)}i.length&&(t=this._getNearPlaneIntersections(e,t,i));let s=1/0,r=-1/0,a=1/0,o=-1/0;for(let l=0;l<t.length;l++){const h=t[l];h.x<s&&(s=h.x),h.x>r&&(r=h.x),h.y<a&&(a=h.y),h.y>o&&(o=h.y)}return{top:o,right:r,bottom:a,left:s}}_computeWebGLBoundingRect(){const e=this._getWorldCoords();let t={top:1-(e.top+1)/2,right:(e.right+1)/2,bottom:1-(e.bottom+1)/2,left:(e.left+1)/2};t.width=t.right-t.left,t.height=t.bottom-t.top,this._boundingRect.worldToDocument={width:t.width*this.renderer._boundingRect.width,height:t.height*this.renderer._boundingRect.height,top:t.top*this.renderer._boundingRect.height+this.renderer._boundingRect.top,left:t.left*this.renderer._boundingRect.width+this.renderer._boundingRect.left,right:t.left*this.renderer._boundingRect.width+this.renderer._boundingRect.left+t.width*this.renderer._boundingRect.width,bottom:t.top*this.renderer._boundingRect.height+this.renderer._boundingRect.top+t.height*this.renderer._boundingRect.height}}getWebGLBoundingRect(){if(this._matrices.modelViewProjection)(!this._boundingRect.worldToDocument||this.alwaysDraw)&&this._computeWebGLBoundingRect();else return this._boundingRect.document;return this._boundingRect.worldToDocument}_getWebGLDrawRect(){return this._computeWebGLBoundingRect(),{top:this._boundingRect.worldToDocument.top-this.drawCheckMargins.top,right:this._boundingRect.worldToDocument.right+this.drawCheckMargins.right,bottom:this._boundingRect.worldToDocument.bottom+this.drawCheckMargins.bottom,left:this._boundingRect.worldToDocument.left-this.drawCheckMargins.left}}_shouldDrawCheck(){const e=this._getWebGLDrawRect();Math.round(e.right)<=this.renderer._boundingRect.left||Math.round(e.left)>=this.renderer._boundingRect.left+this.renderer._boundingRect.width||Math.round(e.bottom)<=this.renderer._boundingRect.top||Math.round(e.top)>=this.renderer._boundingRect.top+this.renderer._boundingRect.height?this._shouldDraw&&(this._shouldDraw=!1,this.renderer.nextRender.add(()=>this._onLeaveViewCallback&&this._onLeaveViewCallback())):(this._shouldDraw||this.renderer.nextRender.add(()=>this._onReEnterViewCallback&&this._onReEnterViewCallback()),this._shouldDraw=!0)}isDrawn(){return this._canDraw&&this.visible&&(this._shouldDraw||this.alwaysDraw)}enableDepthTest(e){this._depthTest=e}_initSources(){let e=0;if(this.autoloadSources){const t=this.htmlElement.getElementsByTagName("img"),i=this.htmlElement.getElementsByTagName("video"),s=this.htmlElement.getElementsByTagName("canvas");t.length&&this.loadImages(t),i.length&&this.loadVideos(i),s.length&&this.loadCanvases(s),e=t.length+i.length+s.length}this.loader._setLoaderSize(e),this._canDraw=!0}_startDrawing(){this._canDraw&&(this._onRenderCallback&&this._onRenderCallback(),this.target?this.renderer.bindFrameBuffer(this.target):this.renderer.state.scenePassIndex===null&&this.renderer.bindFrameBuffer(null),this._setPerspectiveMatrix(),this._setMVMatrix(),(this.alwaysDraw||this._shouldDraw)&&this.visible&&this._draw())}mouseToPlaneCoords(e){if(Pe.setAxisOrder(this.quaternion.axisOrder),Pe.equals(this.quaternion)&&mt.equals(this.transformOrigin))return super.mouseToPlaneCoords(e);{const t={x:2*(e.x/(this.renderer._boundingRect.width/this.renderer.pixelRatio))-1,y:2*(1-e.y/(this.renderer._boundingRect.height/this.renderer.pixelRatio))-1},i=this.camera.position.clone(),s=gt.set(t.x,t.y,-.5);s.unproject(this.camera),s.sub(i).normalize();const r=xt.set(0,0,-1);r.applyQuat(this.quaternion).normalize();const a=_t.set(0,0,0),o=r.dot(s);if(Math.abs(o)>=1e-4){const l=this._matrices.world.matrix.getInverse().multiply(this.camera.viewMatrix),h=this._boundingRect.world.transformOrigin.clone().add(this._translation),c=vt.set(this._translation.x-h.x,this._translation.y-h.y,this._translation.z-h.z);c.applyQuat(this.quaternion),h.add(c);const u=r.dot(h.clone().sub(i))/o;a.copy(i.add(s.multiplyScalar(u))),a.applyMat4(l)}else a.set(1/0,1/0,1/0);return yt.set(a.x,a.y)}}onReEnterView(e){return e&&(this._onReEnterViewCallback=e),this}onLeaveView(e){return e&&(this._onLeaveViewCallback=e),this}}class ge{constructor(e,{shaderPass:t,depth:i=!1,clear:s=!0,maxWidth:r,maxHeight:a,minWidth:o=1024,minHeight:l=1024,texturesOptions:h={}}={}){if(this.type="RenderTarget",e=e&&e.renderer||e,!e||e.type!=="Renderer")z(this.type+": Renderer not passed as first argument",e);else if(!e.gl){e.production||z(this.type+": Unable to create a "+this.type+" because the Renderer WebGL context is not defined");return}this.renderer=e,this.gl=this.renderer.gl,this.index=this.renderer.renderTargets.length,this._shaderPass=t,this._depth=i,this._shouldClear=s,this._maxSize={width:r?Math.min(this.renderer.state.maxTextureSize/4,r):this.renderer.state.maxTextureSize/4,height:a?Math.min(this.renderer.state.maxTextureSize/4,a):this.renderer.state.maxTextureSize/4},this._minSize={width:o*this.renderer.pixelRatio,height:l*this.renderer.pixelRatio},h=Object.assign({sampler:"uRenderTexture",isFBOTexture:!0,premultiplyAlpha:!1,anisotropy:1,generateMipmap:!1,floatingPoint:"none",wrapS:this.gl.CLAMP_TO_EDGE,wrapT:this.gl.CLAMP_TO_EDGE,minFilter:this.gl.LINEAR,magFilter:this.gl.LINEAR},h),this._texturesOptions=h,this.userData={},this.uuid=pe(),this.renderer.renderTargets.push(this),this.renderer.onSceneChange(),this._initRenderTarget()}_initRenderTarget(){this._setSize(),this.textures=[],this._createFrameBuffer()}_restoreContext(){this._setSize(),this._createFrameBuffer()}_setSize(){this._shaderPass&&this._shaderPass._isScenePass?this._size={width:this.renderer._boundingRect.width,height:this.renderer._boundingRect.height}:this._size={width:Math.min(this._maxSize.width,Math.max(this._minSize.width,this.renderer._boundingRect.width)),height:Math.min(this._maxSize.height,Math.max(this._minSize.height,this.renderer._boundingRect.height))}}resize(){this._shaderPass&&(this._setSize(),this.textures[0].resize(),this.renderer.bindFrameBuffer(this,!0),this._depth&&this._bindDepthBuffer(),this.renderer.bindFrameBuffer(null))}_bindDepthBuffer(){this._depthBuffer&&(this.gl.bindRenderbuffer(this.gl.RENDERBUFFER,this._depthBuffer),this.gl.renderbufferStorage(this.gl.RENDERBUFFER,this.gl.DEPTH_COMPONENT16,this._size.width,this._size.height),this.gl.framebufferRenderbuffer(this.gl.FRAMEBUFFER,this.gl.DEPTH_ATTACHMENT,this.gl.RENDERBUFFER,this._depthBuffer))}_createFrameBuffer(){this._frameBuffer=this.gl.createFramebuffer(),this.renderer.bindFrameBuffer(this,!0),this.textures.length?(this.textures[0]._parent=this,this.textures[0]._restoreContext()):new ee(this.renderer,this._texturesOptions).addParent(this),this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER,this.gl.COLOR_ATTACHMENT0,this.gl.TEXTURE_2D,this.textures[0]._sampler.texture,0),this._depth&&(this._depthBuffer=this.gl.createRenderbuffer(),this._bindDepthBuffer()),this.renderer.bindFrameBuffer(null)}getTexture(){return this.textures[0]}remove(){if(this._shaderPass){this.renderer.production||p(this.type+": You're trying to remove a RenderTarget attached to a ShaderPass. You should remove that ShaderPass instead:",this._shaderPass);return}this._dispose(),this.renderer.removeRenderTarget(this)}_dispose(){this._frameBuffer&&(this.gl.deleteFramebuffer(this._frameBuffer),this._frameBuffer=null),this._depthBuffer&&(this.gl.deleteRenderbuffer(this._depthBuffer),this._depthBuffer=null),this.textures[0]._dispose(),this.textures=[]}}class Pt extends be{constructor(e,t,{sampler:i="uPingPongTexture",widthSegments:s,heightSegments:r,renderOrder:a,depthTest:o,cullFace:l,uniforms:h,vertexShaderID:c,fragmentShaderID:u,vertexShader:d,fragmentShader:f,texturesOptions:_,crossOrigin:x,alwaysDraw:P,visible:v,transparent:m,drawCheckMargins:g,autoloadSources:b,watchScroll:R,fov:w}={}){if(o=!1,b=!1,super(e,t,{widthSegments:s,heightSegments:r,renderOrder:a,depthTest:o,cullFace:l,uniforms:h,vertexShaderID:c,fragmentShaderID:u,vertexShader:d,fragmentShader:f,texturesOptions:_,crossOrigin:x,alwaysDraw:P,visible:v,transparent:m,drawCheckMargins:g,autoloadSources:b,watchScroll:R,fov:w}),!this.gl)return;this.renderer.scene.removePlane(this),this.type="PingPongPlane",this.renderer.scene.addPlane(this),this.readPass=new ge(e,{depth:!1,clear:!1,texturesOptions:_}),this.writePass=new ge(e,{depth:!1,clear:!1,texturesOptions:_}),this.createTexture({sampler:i});let S=0;this.readPass.getTexture().onSourceUploaded(()=>{S++,this._checkIfReady(S)}),this.writePass.getTexture().onSourceUploaded(()=>{S++,this._checkIfReady(S)}),this.setRenderTarget(this.readPass),this._onRenderCallback=()=>{this.readPass&&this.writePass&&this.textures[0]&&this.textures[0]._uploaded&&this.setRenderTarget(this.writePass),this._onPingPongRenderCallback&&this._onPingPongRenderCallback()},this._onAfterRenderCallback=()=>{this.readPass&&this.writePass&&this.textures[0]&&this.textures[0]._uploaded&&this._swapPasses(),this._onPingPongAfterRenderCallback&&this._onPingPongAfterRenderCallback()}}_checkIfReady(e){e===2&&this.renderer.nextRender.add(()=>{this.textures[0].copy(this.target.getTexture())})}_swapPasses(){const e=this.readPass;this.readPass=this.writePass,this.writePass=e,this.textures[0].copy(this.readPass.getTexture())}getTexture(){return this.textures[0]}onRender(e){return e&&(this._onPingPongRenderCallback=e),this}onAfterRender(e){return e&&(this._onPingPongAfterRenderCallback=e),this}remove(){this.target=null,this.renderer.bindFrameBuffer(null),this.writePass&&(this.writePass.remove(),this.writePass=null),this.readPass&&(this.readPass.remove(),this.readPass=null),super.remove()}}const bt=(n,e)=>{const t=n[0]/n[1],i=Math.sqrt(t*(3e5*(e||1)));return[i,i/t]},y=(n,e)=>{const t=bt(e),i=t[0]/t[1]>1?4:t[0]/t[1]<1?6:4,r=14/Math.max(...e),a=e.map(o=>Math.round(o*r));return{name:n,dimensions:t.map(o=>Math.round(o)),scaleRatio:e[0]/t[0],realDimensions:e,placeholderPadding:`calc(${e[1]/e[0]*100/i}% - 2rem)`,aspectRatio:e[0]/e[1],iconDimensions:a}};y("iPhone 14 Pro Max",[430,932]),y("iPhone 14 Plus",[428,926]),y("iPhone 14 Pro",[393,852]),y("iPhone 14",[390,844]),y("iPhone 13 Pro Max",[428,926]),y("iPhone 13 Pro",[390,844]),y("iPhone 13 mini",[375,812]),y("iPhone 11 Pro",[375,812]),y("iPhone SE",[320,568]),y("iPhone 8 Plus",[414,736]),y("iPhone 8",[375,667]),y("iPad mini 8.3",[744,1133]),y('iPad Pro 11"',[834,1194]),y('iPad Pro 12.9"',[1024,1366]),y("Instagram Story",[1080,1920]),y("Tabloid",[792,1224]),y("A4",[595,842]),y("Letter",[612,792]),y("Square",[1080,1080]),y("Instagram post",[1080,1080]),y("iPad (legacy)",[1024,768]),y("Slide 4:3",[1024,768]),y("Desktop",[1440,1024]),y("Macbbook Pro",[1440,900]),y("Macbook Pro",[1440,900]),y("Twitter post",[1200,675]),y("iMac",[1280,720]),y("Macbook Air",[1280,832]),y('Macbook Pro 14"',[1512,982]),y('Macbook Pro 16"',[1728,1117]),y("iMac",[1280,720]),y("Slide 16:9",[1920,1080]),y("Twitter header",[1500,500]),y("Dribbble shot",[800,600]),y("LinkedIn cover",[1584,396]),y("TikTok post",[1080,1920]),y("Window",[window.innerWidth,window.innerHeight]);const Tt={NORMAL:"Normal",ADD:"Add",SUBTRACT:"Subtract",MULTIPLY:"Multiply",SCREEN:"Screen",OVERLAY:"Overlay",DARKEN:"Darken",LIGHTEN:"Lighten",COLOR_DODGE:"Color dodge",COLOR_BURN:"Color burn",LINEAR_BURN:"Linear burn",HARD_LIGHT:"Hard light",SOFT_LIGHT:"Soft light",DIFFERENCE:"Difference",EXCLUSION:"Exclusion",LINEAR_LIGHT:"Linear light",PIN_LIGHT:"Pin light",VIVID_LIGHT:"Vivid light"},wt=()=>{var n=new Date().getTime(),e=typeof performance<"u"&&performance.now&&performance.now()*1e3||0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(t){var i=Math.random()*16;return n>0?(i=(n+i)%16|0,n=Math.floor(n/16)):(i=(e+i)%16|0,e=Math.floor(e/16)),(t==="x"?i:i&3|8).toString(16)})},le=(n,e,t)=>n*(1-t)+e*t,Te=(n,e,t,i)=>Math.sqrt(Math.pow(n-t,2)+Math.pow(e-i,2)),Rt=(n,e,t,i)=>(i-t)/(e-n);function St(n){return n.map((e,t)=>t>0?Math.sqrt(Math.pow(e[0]-n[t-1][0],2)+Math.pow(e[1]-n[t-1][1],2)):0).reduce((e,t)=>e+t)}const Mt=(n,e)=>{const t=[n[0]],i=n.length-1;let s=0;for(let r=1;r<i;r++){const a=Te(n[r][0],n[r][1],n[r-1][0],n[r-1][1]);a<=e/2?s<e/2?s+=a:(t.push([le(n[r-1][0],n[r][0],.5),le(n[r-1][1],n[r][1],.5)]),s=0):t.push([le(n[r-1][0],n[r][0],.5),le(n[r-1][1],n[r][1],.5)])}return t.push(n[i]),t},Et=(n,e)=>{const t=St(n),i=Math.floor(t/e),s=[n[0]];function r(a){let o=1,l=0;for(;n[o+1]&&l<a*e;)l+=Te(n[o][0],n[o][1],n[o-1][0],n[o-1][1]),o++;return n[o]}for(let a=0;a<i;a++){const o=r(a),l=Rt(s[a][0],o[0],s[a][1],o[1])||0,h=Math.atan(l),c={x:s[a][0]<=o[0]?1:-1,y:s[a][1]<=o[1]?1:-1};s.push([+(c.x*Math.abs(Math.cos(h))*e+s[a][0]).toFixed(1),+(c.y*Math.abs(Math.sin(h))*e+s[a][1]).toFixed(1)])}return s},we=(n,e)=>{const t=Math.max(1.5,e/500*4);return Et(Mt(n,t),t)},Z="half-float",Re={NORMAL:"src",ADD:"src + dst",SUBTRACT:"src - dst",MULTIPLY:"src * dst",SCREEN:"1. - (1. - src) * (1. - dst)",OVERLAY:"vec3((dst.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - dst.x) * (1.0 - src.x)), (dst.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - dst.y) * (1.0 - src.y)), (dst.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - dst.z) * (1.0 - src.z)))",DARKEN:"min(src, dst)",LIGHTEN:"max(src, dst)",COLOR_DODGE:"vec3((src.x == 1.0) ? 1.0 : min(1.0, dst.x / (1.0 - src.x)), (src.y == 1.0) ? 1.0 : min(1.0, dst.y / (1.0 - src.y)), (src.z == 1.0) ? 1.0 : min(1.0, dst.z / (1.0 - src.z)))",COLOR_BURN:"vec3((src.x == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.x) / src.x)), (src.y == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.y) / src.y)), (src.z == 0.0) ? 0.0 : (1.0 - ((1.0 - dst.z) / src.z)))",LINEAR_BURN:"(src + dst) - 1.0",HARD_LIGHT:"vec3((src.x <= 0.5) ? (2.0 * src.x * dst.x) : (1.0 - 2.0 * (1.0 - src.x) * (1.0 - dst.x)), (src.y <= 0.5) ? (2.0 * src.y * dst.y) : (1.0 - 2.0 * (1.0 - src.y) * (1.0 - dst.y)),  (src.z <= 0.5) ? (2.0 * src.z * dst.z) : (1.0 - 2.0 * (1.0 - src.z) * (1.0 - dst.z)))",SOFT_LIGHT:"vec3((src.x <= 0.5) ? (dst.x - (1.0 - 2.0 * src.x) * dst.x * (1.0 - dst.x)) : (((src.x > 0.5) && (dst.x <= 0.25)) ? (dst.x + (2.0 * src.x - 1.0) * (4.0 * dst.x * (4.0 * dst.x + 1.0) * (dst.x - 1.0) + 7.0 * dst.x)) : (dst.x + (2.0 * src.x - 1.0) * (sqrt(dst.x) - dst.x))), (src.y <= 0.5) ? (dst.y - (1.0 - 2.0 * src.y) * dst.y * (1.0 - dst.y)) : (((src.y > 0.5) && (dst.y <= 0.25)) ? (dst.y + (2.0 * src.y - 1.0) * (4.0 * dst.y * (4.0 * dst.y + 1.0) * (dst.y - 1.0) + 7.0 * dst.y)) : (dst.y + (2.0 * src.y - 1.0) * (sqrt(dst.y) - dst.y))), (src.z <= 0.5) ? (dst.z - (1.0 - 2.0 * src.z) * dst.z * (1.0 - dst.z)) : (((src.z > 0.5) && (dst.z <= 0.25)) ? (dst.z + (2.0 * src.z - 1.0) * (4.0 * dst.z * (4.0 * dst.z + 1.0) * (dst.z - 1.0) + 7.0 * dst.z)) : (dst.z + (2.0 * src.z - 1.0) * (sqrt(dst.z) - dst.z))))",DIFFERENCE:"abs(dst - src)",EXCLUSION:"src + dst - 2.0 * src * dst",LINEAR_LIGHT:"2.0 * src + dst - 1.0",PIN_LIGHT:"vec3((src.x > 0.5) ? max(dst.x, 2.0 * (src.x - 0.5)) : min(dst.x, 2.0 * src.x), (src.x > 0.5) ? max(dst.y, 2.0 * (src.y - 0.5)) : min(dst.y, 2.0 * src.y), (src.z > 0.5) ? max(dst.z, 2.0 * (src.z - 0.5)) : min(dst.z, 2.0 * src.z))",VIDID_LIGHT:"vec3((src.x <= 0.5) ? (1.0 - (1.0 - dst.x) / (2.0 * src.x)) : (dst.x / (2.0 * (1.0 - src.x))), (src.y <= 0.5) ? (1.0 - (1.0 - dst.y) / (2.0 * src.y)) : (dst.y / (2.0 * (1.0 - src.y))), (src.z <= 0.5) ? (1.0 - (1.0 - dst.z) / (2.0 * src.z)) : (dst.z / (2.0 * (1.0 - src.z))))"};let Se="";Object.keys(Re).forEach((n,e)=>{Se+=`
    if(blendMode == ${e}) {
      return ${Re[n]};
    }
  `});const At=`
  vec3 blend (int blendMode, vec3 src, vec3 dst) {
    ${Se} 
  }
`,j={LINEAR:"t",EASE_IN_QUAD:"t * t",EASE_OUT_QUAD:"t * (2.0 - t)",EASE_IN_OUT_QUAD:"t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t",EASE_IN_CUBIC:"t * t * t",EASE_OUT_CUBIC:"--t * t * t + 1.0",EASE_IN_OUT_CUBIC:"t < 0.5 ? 4.0 * t * t * t : (t - 1.0) * (2.0 * t - 2.0) * (2.0 * t - 2.0) + 1.0",EASE_IN_QUART:"t * t * t * t",EASE_OUT_QUART:"1.0 - (--t) * t * t * t",EASE_IN_OUT_QUART:"t < 0.5 ? 8.0 * t * t * t * t : 1.0 - 8.0 * (--t) * t * t * t",EASE_IN_QUINT:"t * t * t * t * t",EASE_OUT_QUINT:"1.0 + (--t) * t * t * t * t",EASE_IN_OUT_QUINT:"t < 0.5 ? 16.0 * t * t * t * t * t : 1.0 + 16.0 * (--t) * t * t * t * t",EASE_IN_CIRC:"1.0 - sqrt(1.0 - t * t)",EASE_OUT_CIRC:"sqrt((2.0 - t) * t)",EASE_IN_OUT_CIRC:"t < 0.5 ? (1.0 - sqrt(1.0 - 4.0 * t * t)) / 2.0 : (sqrt(-((2.0 * t) - 3.0) * ((2.0 * t) - 1.0)) + 1.0) / 2.0",EASE_IN_EXPO:"t == 0.0 ? 0.0 : pow(2.0, 10.0 * (t - 1.0))",EASE_OUT_EXPO:"t == 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * t)",EASE_IN_OUT_EXPO:"t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : t < 0.5 ? pow(2.0, (20.0 * t) - 10.0) / 2.0 : (2.0 - pow(2.0, -20.0 * t + 10.0)) / 2.0",EASE_IN_SINE:"1.0 - cos((t * 3.141592654) / 2.0)",EASE_OUT_SINE:"sin((t * 3.141592654) / 2.0)",EASE_IN_OUT_SINE:"-(cos(3.141592654 * t) - 1.0) / 2.0",EASE_IN_ELASTIC:"t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : -pow(2.0, 10.0 * t - 10.0) * sin((t * 10.0 - 10.75) * ((2.0 * 3.141592654) / 3.0))",EASE_OUT_ELASTIC:"t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : pow(2.0, -10.0 * t) * sin((t * 10.0 - 0.75) * ((2.0 * 3.141592654) / 3.0)) + 1.0",EASE_IN_OUT_ELASTIC:"t == 0.0 ? 0.0 : t == 1.0 ? 1.0 : t < 0.5 ? -(pow(2.0, 20.0 * t - 10.0) * sin((20.0 * t - 11.125) * ((2.0 * 3.141592654) / 4.5))) / 2.0 : (pow(2.0, -20.0 * t + 10.0) * sin((20.0 * t - 11.125) * ((2.0 * 3.141592654) / 4.5))) / 2.0 + 1.0"};let Me="";Object.keys(j).forEach((n,e)=>{Me+=`
    case ${e}: return ${j[n]}; break;
  `});const K=`
  float ease (int easingFunc, float t) {
    switch(uEasing) {
      ${Me} 
    }
  }
`,X=`
  uniform sampler2D uMaskTexture;
  uniform int uIsMask;
  uniform float uAspectRatio;
  uniform float uTrackMouse;
  uniform vec2 uMousePos;
  uniform vec2 uResolution;
`,q={isMask:{name:"uIsMask",type:"1i",value:0},mousePos:{name:"uMousePos",type:"2f",value:new T(.5)},resolution:{name:"uResolution",type:"2f",value:new T(1080)},trackMouse:{name:"uTrackMouse",type:"1f",value:0}},Y=n=>`
  if(uIsMask == 1) {
    vec4 maskColor = texture(uMaskTexture, vTextureCoord);
    fragColor = ${n} * (maskColor.a * maskColor.a);
  } else {
    fragColor = ${n};
  }
`,he=`#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}`,Ee=`#version 300 es
precision mediump float;

in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uTextureMatrix;
uniform vec2 uMousePos;

out vec2 vTextureCoord;
out vec3 vVertexPosition;

void main() {
    float angleX = uMousePos.y * 0.5 - 0.25; // Vertical mouse movement tilts around the X-axis
    float angleY = (1.-uMousePos.x) * 0.5 - 0.25; // Horizontal mouse movement tilts around the Y-axis

    // Rotation matrices around X and Y axes
    mat4 rotateX = mat4(1.0, 0.0, 0.0, 0.0,
                        0.0, cos(angleX), -sin(angleX), 0.0,
                        0.0, sin(angleX), cos(angleX), 0.0,
                        0.0, 0.0, 0.0, 1.0);
    mat4 rotateY = mat4(cos(angleY), 0.0, sin(angleY), 0.0,
                        0.0, 1.0, 0.0, 0.0,
                        -sin(angleY), 0.0, cos(angleY), 0.0,
                        0.0, 0.0, 0.0, 1.0);

    mat4 rotationMatrix = rotateX * rotateY;
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    vVertexPosition = (rotationMatrix * vec4(aVertexPosition, 1.0)).xyz;
    vTextureCoord = (uTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}`,Ct=`
  // CC0 license https://creativecommons.org/share-your-work/public-domain/cc0/
  // Borrowed from Stefan Gustavson's noise code

  vec4 permute(vec4 t) {
      return t * (t * 34.0 + 133.0);
  }

  // Gradient set is a normalized expanded rhombic dodecahedron
  vec3 grad(float hash) {
      
      // Random vertex of a cube, +/- 1 each
      vec3 cube = mod(floor(hash / vec3(1.0, 2.0, 4.0)), 2.0) * 2.0 - 1.0;
      
      // Random edge of the three edges connected to that vertex
      // Also a cuboctahedral vertex
      // And corresponds to the face of its dual, the rhombic dodecahedron
      vec3 cuboct = cube;
      cuboct[int(hash / 16.0)] = 0.0;
      
      // In a funky way, pick one of the four points on the rhombic face
      float type = mod(floor(hash / 8.0), 2.0);
      vec3 rhomb = (1.0 - type) * cube + type * (cuboct + cross(cube, cuboct));
      
      // Expand it so that the new edges are the same length
      // as the existing ones
      vec3 grad = cuboct * 1.22474487139 + rhomb;
      
      // To make all gradients the same length, we only need to shorten the
      // second type of vector. We also put in the whole noise scale constant.
      // The compiler should reduce it into the existing floats. I think.
      grad *= (1.0 - 0.042942436724648037 * type) * 3.5946317686139184;
      
      return grad;
  }

  // BCC lattice split up into 2 cube lattices
  vec4 bccNoiseDerivativesPart(vec3 X) {
      vec3 b = floor(X);
      vec4 i4 = vec4(X - b, 2.5);
      
      // Pick between each pair of oppposite corners in the cube.
      vec3 v1 = b + floor(dot(i4, vec4(.25)));
      vec3 v2 = b + vec3(1, 0, 0) + vec3(-1, 1, 1) * floor(dot(i4, vec4(-.25, .25, .25, .35)));
      vec3 v3 = b + vec3(0, 1, 0) + vec3(1, -1, 1) * floor(dot(i4, vec4(.25, -.25, .25, .35)));
      vec3 v4 = b + vec3(0, 0, 1) + vec3(1, 1, -1) * floor(dot(i4, vec4(.25, .25, -.25, .35)));
      
      // Gradient hashes for the four vertices in this half-lattice.
      vec4 hashes = permute(mod(vec4(v1.x, v2.x, v3.x, v4.x), 289.0));
      hashes = permute(mod(hashes + vec4(v1.y, v2.y, v3.y, v4.y), 289.0));
      hashes = mod(permute(mod(hashes + vec4(v1.z, v2.z, v3.z, v4.z), 289.0)), 48.0);
      
      // Gradient extrapolations & kernel function
      vec3 d1 = X - v1; vec3 d2 = X - v2; vec3 d3 = X - v3; vec3 d4 = X - v4;
      vec4 a = max(0.75 - vec4(dot(d1, d1), dot(d2, d2), dot(d3, d3), dot(d4, d4)), 0.0);
      vec4 aa = a * a; vec4 aaaa = aa * aa;
      vec3 g1 = grad(hashes.x); vec3 g2 = grad(hashes.y);
      vec3 g3 = grad(hashes.z); vec3 g4 = grad(hashes.w);
      vec4 extrapolations = vec4(dot(d1, g1), dot(d2, g2), dot(d3, g3), dot(d4, g4));
      
      // Derivatives of the noise
      vec3 derivative = -8.0 * mat4x3(d1, d2, d3, d4) * (aa * a * extrapolations)
          + mat4x3(g1, g2, g3, g4) * aaaa;
      
      // Return it all as a vec4
      return vec4(derivative, dot(aaaa, extrapolations));
  }

  // Rotates domain, but preserve shape. Hides grid better in cardinal slices.
  // Good for texturing 3D objects with lots of flat parts along cardinal planes.
  vec4 bccNoiseDerivatives_XYZ(vec3 X) {
      X = dot(X, vec3(2.0/3.0)) - X;
      
      vec4 result = bccNoiseDerivativesPart(X) + bccNoiseDerivativesPart(X + 144.5);
      
      return vec4(dot(result.xyz, vec3(2.0/3.0)) - result.xyz, result.w);
  }

  // Gives X and Y a triangular alignment, and lets Z move up the main diagonal.
  // Might be good for terrain, or a time varying X/Y plane. Z repeats.
  vec4 bccNoiseDerivatives_XYBeforeZ(vec3 X) {
      
      // Not a skew transform.
      mat3 orthonormalMap = mat3(
          0.788675134594813, -0.211324865405187, -0.577350269189626,
          -0.211324865405187, 0.788675134594813, -0.577350269189626,
          0.577350269189626, 0.577350269189626, 0.577350269189626);
      
      X = orthonormalMap * X;
      vec4 result = bccNoiseDerivativesPart(X) + bccNoiseDerivativesPart(X + 144.5);
      
      return vec4(result.xyz * orthonormalMap, result.w);
  }
`,kt=`
  // https://www.shadertoy.com/view/4sc3z2

  float hash31(vec3 p3)
  {
    p3  = fract(p3 * vec3(.1031,.11369,.13787));
      p3 += dot(p3, p3.yzx + 19.19);
      return -1.0 + 2.0 * fract((p3.x + p3.y) * p3.z);
  }
  vec3 hash33(vec3 p3)
  {
    p3 = fract(p3 * vec3(.1031,.11369,.13787));
      p3 += dot(p3, p3.yxz+19.19);
      return -1.0 + 2.0 * fract(vec3((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y, (p3.y+p3.z)*p3.x));
  }

  float perlin_noise(vec3 p)
  {
      vec3 pi = floor(p);
      vec3 pf = p - pi;
      
      vec3 w = pf * pf * (3.0 - 2.0 * pf);
      
      return 	mix(
              mix(
                    mix(dot(pf - vec3(0, 0, 0), hash33(pi + vec3(0, 0, 0))), 
                          dot(pf - vec3(1, 0, 0), hash33(pi + vec3(1, 0, 0))),
                          w.x),
                    mix(dot(pf - vec3(0, 0, 1), hash33(pi + vec3(0, 0, 1))), 
                          dot(pf - vec3(1, 0, 1), hash33(pi + vec3(1, 0, 1))),
                          w.x),
                    w.z),
              mix(
                      mix(dot(pf - vec3(0, 1, 0), hash33(pi + vec3(0, 1, 0))), 
                          dot(pf - vec3(1, 1, 0), hash33(pi + vec3(1, 1, 0))),
                          w.x),
                      mix(dot(pf - vec3(0, 1, 1), hash33(pi + vec3(0, 1, 1))), 
                          dot(pf - vec3(1, 1, 1), hash33(pi + vec3(1, 1, 1))),
                          w.x),
                    w.z),
            w.y);
}
`,It={fragmentShader:`#version 300 es
  precision mediump float;
  in vec3 vVertexPosition;
  in vec2 vTextureCoord;
  uniform sampler2D uTexture;
  uniform sampler2D uPingPongTexture;
  uniform vec2 uMousePos;
  uniform vec2 uPreviousMousePos;
  uniform float uRadius;
  uniform float uDissipate;
  uniform vec2 uResolution;
  uniform float uDecay;
  uniform float uLiquidity;
  uniform float uTime;

  const float PI = 3.1415926;

  out vec4 fragColor;

  vec3 rgb2hsv(vec3 c)
  {
      vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
      vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
      vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

      float d = q.x - min(q.w, q.y);
      float e = 1.0e-10;
      return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
  }

  // Easing function for smooth wave transitions
  float easeInOut(float t) {
    return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
  }

  vec3 hsv2rgb(vec3 c)
  {
      vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
      vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
      return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float linePointDist(vec2 P1, vec2 P2, vec2 P0) {
    return abs((P2.y - P1.y) * P0.x - (P2.x - P1.x) * P0.y + P2.x * P1.y - P2.y * P1.x) /
        length(P2 - P1);
  }

// New function to convert angle to 2D direction vector
vec2 angleToDir(float angle) {
    float rad = angle * 2.0 * PI;
    return vec2(cos(rad), sin(rad));
}

vec2 liquify(vec2 st, float angle) {
  vec2 direction = angleToDir(angle);
  vec2 uPos = vec2(0.5);
  float xPos = 1.0 - uPos.y * 10.0;
  float yPos = 1.0 - uPos.x * 10.0;
  float amplitude = 0.002;

  for(float i = 1.0; i < 4.0; i++){
      float influence = dot(direction, vec2(cos(i * st.x), sin(i * st.y))) * 0.5;

      st.x += (amplitude / i) *
              (cos(i * 7.0 * st.y + uTime * 0.01 + xPos) +
               cos(i * 9.0 * st.y + uTime * 0.02 + xPos) +
               cos(i * 11.0 * st.y * 2.0 + uTime * 0.125 + xPos) * influence);

      st.y += (amplitude / i) *
              (sin(i * 7.0 * st.x + uTime * 0.01 + yPos) +
               sin(i * 9.0 * st.x + uTime * 0.02 + yPos) +
               sin(i * 11.0 * st.x * 2.0 + uTime * 0.125 + yPos) * influence);
  }
  vec2 dir = normalize(uMousePos - uPreviousMousePos);

  //st += dir * min(0.1, distance(st, uMousePos)) * 0.01;
  return st;
}

  const float TWOPI = 6.2831852;
  const float edgeSoftness = 0.75;
  
  void main() {
    float aspectRatio = uResolution.x/uResolution.y;
    vec2 uv = vTextureCoord;
    vec2 dir = normalize(uMousePos - uPreviousMousePos);  // Direction of mouse movement
    
    float strength = length(uMousePos - uPreviousMousePos);
    
    float rad = uRadius * 0.4 * mix(aspectRatio, 1., 0.5);
    float angle = atan(dir.y, dir.x);
    angle += angle < 0. ? TWOPI : 0.;
    
    uv = mix(uv, liquify(uv, smoothstep(0., 1., angle)), uLiquidity);

    float dist = linePointDist(uMousePos * vec2(aspectRatio, 1), uPreviousMousePos * vec2(aspectRatio, 1), uv * vec2(aspectRatio, 1));
    float s1 = smoothstep(rad, rad * 0.25, dist);
    s1 *= smoothstep(rad, rad * 0.25, distance(uv * vec2(aspectRatio, 1), uMousePos * vec2(aspectRatio, 1)));


    vec3 color = vec3(0.8333, 1, 1);
    color.x = angle / TWOPI;
    vec3 mouseColor = hsv2rgb(color); 

    vec3 lastFrameColor = texture(uPingPongTexture, mix(uv, uv/1.03 + 0.015, uDissipate)).rgb;

    vec3 draw = mix(lastFrameColor, mouseColor, strength * s1);

    fragColor = vec4(draw * pow(uDecay, 0.1), 1);
  }`,vertexShader:`#version 300 es
precision mediump float;

// default mandatory variables
in vec3 aVertexPosition;
in vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

// custom variables
out vec3 vVertexPosition;
out vec2 vTextureCoord;

void main() {

    vec3 vertexPosition = aVertexPosition;

    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

    // varyings
    vTextureCoord = aTextureCoord;
    vVertexPosition = vertexPosition;
}
`,crossorigin:"Anonymous",downSample:!0,texturesOptions:{floatingPoint:"half-float",premultiplyAlpha:!0},uniforms:{pos:{name:"uPos",type:"2f",value:new T(.5)},previousMousePos:{name:"uPreviousMousePos",type:"2f",value:new T(.5)},radius:{name:"uRadius",type:"1f",value:.5},time:{name:"uTime",type:"1f",value:0},liquidity:{name:"uLiquidity",type:"1f",value:0},dissipate:{name:"uDissipate",type:"1f",value:.25},decay:{name:"uDecay",type:"1f",value:.5},...q}},Dt={fragmentShader:`#version 300 es
precision lowp float;
in vec3 vVertexPosition;
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uAmount;
uniform int uEasing;
uniform float uTilt;
uniform float uTime;
uniform vec2 uPos;

${X}
${K}

const float PI = 3.14159265;
const int SAMPLES = 128;
const vec2 uDiskSamples[128] = vec2[](
  vec2(0, 0),
  vec2(0.7062550187110901, 0.03469608351588249),
  vec2(0.49759235978126526, 0.0490085706114769),
  vec2(0.8566519618034363, 0.1270723193883896),
  vec2(0.34675997495651245, 0.06897484511137009),
  vec2(0.7668770551681519, 0.19209270179271698),
  vec2(0.5860038995742798, 0.17776232957839966),
  vec2(0.880733847618103, 0.31513160467147827),
  vec2(0.2309698760509491, 0.09567085653543472),
  vec2(0.6779919862747192, 0.3206663131713867),
  vec2(0.49300897121429443, 0.2635187804698944),
  vec2(0.7731460928916931, 0.46340593695640564),
  vec2(0.3600369095802307, 0.24056896567344666),
  vec2(0.6659845113754272, 0.4939277768135071),
  vec2(0.5112983584403992, 0.41961172223091125),
  vec2(0.7174228429794312, 0.6502341628074646),
  vec2(0.125, 0.125),
  vec2(0.4894784986972809, 0.5400562882423401),
  vec2(0.336437851190567, 0.40995070338249207),
  vec2(0.5265287756919861, 0.7099418640136719),
  vec2(0.21960841119289398, 0.32866722345352173),
  vec2(0.41647082567214966, 0.694839596748352),
  vec2(0.3004576563835144, 0.5621167421340942),
  vec2(0.40702033042907715, 0.8605721592903137),
  vec2(0.11717239022254944, 0.28287917375564575),
  vec2(0.25959107279777527, 0.725508451461792),
  vec2(0.17019447684288025, 0.5610560178756714),
  vec2(0.2231915444135666, 0.8910306096076965),
  vec2(0.0912451446056366, 0.45872029662132263),
  vec2(0.12439680844545364, 0.8386151790618896),
  vec2(0.06710775196552277, 0.6813564300537109),
  vec2(0.048294905573129654, 0.9830654263496399),
  vec2(7.654042828657299e-18, 0.125),
  vec2(-0.03523404151201248, 0.7172054052352905),
  vec2(-0.05051687732338905, 0.5129064917564392),
  vec2(-0.1283891648054123, 0.8655294179916382),
  vec2(-0.0731588676571846, 0.3677944839000702),
  vec2(-0.19447903335094452, 0.7764038443565369),
  vec2(-0.18142792582511902, 0.598087728023529),
  vec2(-0.3179328143596649, 0.8885627388954163),
  vec2(-0.10696326941251755, 0.2582321763038635),
  vec2(-0.3250895142555237, 0.6873440146446228),
  vec2(-0.27002641558647156, 0.5051838755607605),
  vec2(-0.4678405523300171, 0.7805448174476624),
  vec2(-0.2503921091556549, 0.37473827600479126),
  vec2(-0.4995090663433075, 0.6735100150108337),
  vec2(-0.4270390570163727, 0.5203486084938049),
  vec2(-0.6556304097175598, 0.7233766317367554),
  vec2(-0.1530931144952774, 0.1530931144952774),
  vec2(-0.547940731048584, 0.49662455916404724),
  vec2(-0.4211843013763428, 0.34565702080726624),
  vec2(-0.7170061469078064, 0.5317679643630981),
  vec2(-0.3447090983390808, 0.23032724857330322),
  vec2(-0.7030628323554993, 0.42139965295791626),
  vec2(-0.5728246569633484, 0.3061811625957489),
  vec2(-0.867959201335907, 0.41051411628723145),
  vec2(-0.3055444359779358, 0.12656064331531525),
  vec2(-0.7349926233291626, 0.2629845440387726),
  vec2(-0.5736655592918396, 0.17401954531669617),
  vec2(-0.8992430567741394, 0.22524864971637726),
  vec2(-0.47482064366340637, 0.09444769471883774),
  vec2(-0.8476815819740295, 0.12574167549610138),
  vec2(-0.692619264125824, 0.06821703910827637),
  vec2(-0.9909616708755493, 0.04868282377719879),
  vec2(-0.0883883461356163, 1.0824450754283193e-17),
  vec2(-0.7117512822151184, -0.03496609628200531),
  vec2(-0.5053074359893799, -0.04976843670010567),
  vec2(-0.8611021637916565, -0.12773244082927704),
  vec2(-0.35743197798728943, -0.07109764218330383),
  vec2(-0.7716551423072815, -0.19328954815864563),
  vec2(-0.5920765995979309, -0.17960448563098907),
  vec2(-0.8846569657325745, -0.3165353238582611),
  vec2(-0.2449805587530136, -0.10147427022457123),
  vec2(-0.6826840043067932, -0.3228854835033417),
  vec2(-0.49913355708122253, -0.2667924463748932),
  vec2(-0.7768542766571045, -0.4656285345554352),
  vec2(-0.36746111512184143, -0.2455296814441681),
  vec2(-0.6697578430175781, -0.49672624468803406),
  vec2(-0.5158433318138123, -0.42334166169166565),
  vec2(-0.7204058766365051, -0.6529378294944763),
  vec2(-0.1397542506456375, -0.1397542506456375),
  vec2(-0.4930644631385803, -0.5440127849578857),
  vec2(-0.34107857942581177, -0.41560545563697815),
  vec2(-0.529154896736145, -0.7134827375411987),
  vec2(-0.22503165900707245, -0.33678367733955383),
  vec2(-0.41894248127937317, -0.6989632844924927),
  vec2(-0.3033328950405121, -0.5674959421157837),
  vec2(-0.40877094864845276, -0.8642735481262207),
  vec2(-0.12195689231157303, -0.2944299876689911),
  vec2(-0.26129332184791565, -0.7302659153938293),
  vec2(-0.17211763560771942, -0.567395806312561),
  vec2(-0.22422246634960175, -0.8951462507247925),
  vec2(-0.09286022931337357, -0.46683987975120544),
  vec2(-0.12507104873657227, -0.8431605696678162),
  vec2(-0.06766466796398163, -0.6870108842849731),
  vec2(-0.04848925396800041, -0.9870214462280273),
  vec2(-2.81227478546514e-17, -0.1530931144952774),
  vec2(0.03549996390938759, -0.7226183414459229),
  vec2(0.05125438794493675, -0.5203945636749268),
  vec2(0.12904255092144012, -0.8699342012405396),
  vec2(0.0751635953783989, -0.37787291407585144),
  vec2(0.1956612914800644, -0.7811236381530762),
  vec2(0.18323321640491486, -0.6040389537811279),
  vec2(0.31932422518730164, -0.8924514055252075),
  vec2(0.11218402534723282, -0.27083620429039),
  vec2(0.3272787034511566, -0.6919726729393005),
  vec2(0.27322208881378174, -0.5111625790596008),
  vec2(0.4700421690940857, -0.7842180132865906),
  vec2(0.25516191124916077, -0.38187679648399353),
  vec2(0.5022764205932617, -0.6772413849830627),
  vec2(0.43070468306541443, -0.5248152017593384),
  vec2(0.6583119034767151, -0.7263352870941162),
  vec2(0.16535945236682892, -0.16535945236682892),
  vec2(0.5518407225608826, -0.5001592636108398),
  vec2(0.4266902208328247, -0.3501756191253662),
  vec2(0.720512330532074, -0.5343683362007141),
  vec2(0.35245633125305176, -0.23550379276275635),
  vec2(0.7071385979652405, -0.42384254932403564),
  vec2(0.5781042575836182, -0.30900317430496216),
  vec2(0.8716292381286621, -0.41224992275238037),
  vec2(0.31626853346824646, -0.13100272417068481),
  vec2(0.7396891117095947, -0.26466497778892517),
  vec2(0.5798675417900085, -0.1759008914232254),
  vec2(0.9033212661743164, -0.22627019882202148),
  vec2(0.4826694428920746, -0.09600891917943954),
  vec2(0.8521785736083984, -0.12640875577926636),
  vec2(0.6981825828552246, -0.06876497715711594),
  vec2(0.9948862791061401, -0.04887562617659569)
);

vec3 bokehBlur(vec2 uv, float blurRadius, float intensity) {
    float aspectRatio = uResolution.x / uResolution.y;
    vec3 accumulatedColor = vec3(0.0);
    vec3 accumulatedWeights = vec3(0.0);
    vec2 pixelSize = vec2(1.0 / aspectRatio, 1.0) * blurRadius * 0.075;

    for (int i = 0; i < SAMPLES; i++) {
        vec2 sampleOffset = uDiskSamples[i] * pixelSize;
        vec3 colorSample = texture(uTexture, uv + sampleOffset).xyz;
        vec3 bokehWeight = vec3(5.0) + pow(colorSample, vec3(9.0)) * intensity;

        accumulatedColor += colorSample * bokehWeight;
        accumulatedWeights += bokehWeight;
    }

    return accumulatedColor / accumulatedWeights;
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec2 pos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
  float dis = distance(uv, pos) * 1000.;
  float tilt = mix(1.-dis * 0.001 , dis * 0.001, uTilt);
  vec4 color = vec4(bokehBlur(uv, uAmount * ease(uEasing, tilt), 150.0), 1.0);
  ${Y("color")}
}
`,crossorigin:"Anonymous",vertexShader:he,depthTest:!1,texturesOptions:{floatingPoint:Z,premultiplyAlpha:!0},uniforms:{radius:{name:"uAmount",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new T(.5)},time:{name:"uTime",type:"1f",value:0},tilt:{name:"uTilt",type:"1f",value:0},easing:{name:"uEasing",type:"1i",value:0},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const zt={fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uAmount;
  uniform float uWarp;
  uniform float uSkew;
  uniform int uDirection;
  uniform int uType;
  uniform int uEasing;
  uniform vec2 uPos;
  ${X}
  ${K}

  out vec4 fragColor;

  float random(vec2 seed) {
    return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  const int kernelSize = 36;
  const float gaussianWeights[kernelSize] = float[](0.00094768, 0.00151965, 0.00237008, 0.00359517, 0.0053041,
                                                    0.00761097, 0.01062197, 0.01441804, 0.01903459, 0.0244409,
                                                    0.03052299, 0.03707432, 0.04379813, 0.05032389, 0.05623791,
                                                    0.06112521, 0.06461716, 0.06643724, 0.06643724, 0.06461716,
                                                    0.06112521, 0.05623791, 0.05032389, 0.04379813, 0.03707432,
                                                    0.03052299, 0.0244409, 0.01903459, 0.01441804, 0.01062197,
                                                    0.00761097, 0.0053041, 0.00359517, 0.00237008, 0.00151965,
                                                    0.00094768);

  vec4 GaussianBlur(sampler2D tex, vec2 uv, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 pos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
    float inner = distance(uv, pos);
    float outer = max(0., 1.-distance(uv, pos));

    float amt = uDirection <= 1 ? 6. : 11.;
    float amount = (uAmount * amt) * ease(uEasing, mix(inner, outer, uWarp));
 
    color += texture(tex, uv) * gaussianWeights[0];
    
    for (int i = 0; i < kernelSize; i++) {
      float x = float(i - kernelSize / 2) * amount;
      color += texture(tex, uv + vec2(x * 0.001) * direction * vec2(uSkew, 1. - uSkew)) * gaussianWeights[i];
    }

    float dither = (random(gl_FragCoord.xy) - 0.5) / 255.0;
    color.rgb += dither;

    
    return color;
  }

  vec4 BoxBlur(sampler2D tex, vec2 uv, vec2 direction) {
    vec4 color = vec4(0.0);

    vec2 pos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
    float inner = distance(uv, pos);
    float outer = max(0., 1.-distance(uv, pos));
    float amount = uAmount * ease(uEasing, mix(inner, outer, uWarp));
    
    for (int i = 0; i < kernelSize; i++) {
      float x = float(i - kernelSize / 2) * amount/144.;
      color += texture(tex, uv + vec2(x) * direction * vec2(uSkew, 1. - uSkew));
    }
    
    return color/float(kernelSize);
  }

  void main() {	
    vec2 uv = vTextureCoord;
    vec4 color = vec4(0);
    int dir = uDirection % 2;
    vec2 direction = dir == 1 ? vec2(0, uResolution.x/uResolution.y) : vec2(1, 0);
    if(uType == 0) {
      color = GaussianBlur(uTexture, uv, direction);
    } else {
      color = BoxBlur(uTexture, uv, direction);
    }

    ${Y("color")}
  }
`,vertexShader:he,crossorigin:"Anonymous",depthTest:!1,texturesOptions:{floatingPoint:Z},uniforms:{blurType:{name:"uType",type:"1i",value:0},amount:{name:"uAmount",type:"1f",value:.2},vertical:{name:"uDirection",type:"1i",value:0},warp:{name:"uWarp",type:"1f",value:.5},skew:{name:"uSkew",type:"1f",value:.5},easing:{name:"uEasing",type:"1i",value:0},pos:{name:"uPos",type:"2f",value:new T(.5)},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const Ot={fragmentShader:`#version 300 es
precision mediump float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;

uniform float uAmount;
uniform float uTime;
uniform float xy;
uniform float uDirection;
uniform float uGrain;
uniform float uWarp;
uniform int uEasing;
uniform vec2 uPos;
${X}
${K}

const float MAX_ITERATIONS = 24.;
const float PI = 3.14159265;
const float TWOPI = 6.2831853;


float random(vec2 seed) {
  seed.x *= uResolution.x/uResolution.y;
  return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec2 pos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
  float aspectRatio = uResolution.x/uResolution.y;
  float delta = fract(floor(uTime)/20.);
  float angle, rotation, amp;
  float inner = distance(uv, pos);
  float outer = max(0., 1.-distance(uv, pos));

  float amount = uAmount * ease(uEasing, mix(inner, outer, uWarp)) * 2.;

  angle = random(uv + vec2(0.1 + delta, 0));
  rotation = angle * TWOPI;
  amp = random(uv + vec2(0.2 + delta, 0));

  vec2 offset_rough = vec2(cos(rotation) / aspectRatio * uDirection, sin(rotation) * (1. - uDirection)) * mix(amp, 1., 0.1) * amount * 0.5;
  vec4 rough = texture(uTexture, uv + offset_rough);
  vec4 fine = vec4(0);

  for(float i = 1.; i <= MAX_ITERATIONS; i++) {
    float th = i/MAX_ITERATIONS;
    angle = random(uv + vec2(delta + 1.2 + th, 0));
    rotation = angle * TWOPI;
    amp = random(uv + vec2(delta + 0.1 + th, 0));

    vec2 offset_fine = vec2(cos(rotation) / aspectRatio * uDirection, sin(rotation) * (1. - uDirection)) * mix(amp, 1., 0.1) * amount * 0.5;
    fine += texture(uTexture, uv + offset_fine);
  }

  fine /= MAX_ITERATIONS;

  vec4 col = mix(fine, rough, uGrain);

  ${Y("col")}
}

`,vertexShader:he,crossorigin:"Anonymous",depthTest:!1,texturesOptions:{floatingPoint:Z,premultiplyAlpha:!0},uniforms:{time:{name:"uTime",type:"1f",value:0},amount:{name:"uAmount",type:"1f",value:.25},warp:{name:"uWarp",type:"1f",value:0},graininess:{name:"uGrain",type:"1f",value:.5},direction:{name:"uDirection",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new T(.5)},easing:{name:"uEasing",type:"1i",value:0},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const Ft={fragmentShader:`#version 300 es
precision mediump float;

in vec2 vTextureCoord;

uniform sampler2D uTexture;
uniform float uTime;
uniform float uAmplitude;
uniform float uPhase;
uniform float uFrequency;
uniform float uTurbulence;
uniform float uMixRadius;
uniform vec2 uPos;
uniform int uEasing;
uniform float uAngle;
${X}
${K}
${kt}

const int OCTAVES = 6;
const float PI = 3.14159265359;
mat2 rot(float a) {
  return mat2(cos(a),-sin(a),sin(a),cos(a));
}

float fbm (in vec3 st) {
  float value = 0.0;
  float amp = .25;
  float frequency = 0.;
  float aM = (0.1 + uAmplitude * .65);
  vec2 shift = vec2(100.0);
  mat2 rot = mat2(cos(0.5), sin(0.5),
                  -sin(0.5), cos(0.5));
  for (int i = 0; i < OCTAVES; i++) {
      value += amp * perlin_noise(st);
      st.xy *= rot * 2.5;
      st.xy += shift;
      amp *= aM;
  }
  return value;
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  
  float aspectRatio = uResolution.x/uResolution.y;
  
  float multiplier = 6.0 * (uFrequency / ((aspectRatio + 1.) / 2.));

  vec2 mPos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
  vec2 pos = uMixRadius == 1. ? mPos : uPos;
  float dist = ease(uEasing, max(0.,1.-distance(uv * vec2(aspectRatio, 1), mPos * vec2(aspectRatio, 1)) * 4. * (1. - uMixRadius)));

  if(dist < distance(uv, mPos)) {
    vec4 color = texture(uTexture, uv);
    ${Y("color")}
  }

  vec2 st = (uv * vec2(aspectRatio, 1) + (1. - pos) - vec2(1)) * multiplier * aspectRatio;
  
  st = rot(uAngle * -1. * 2.0 * PI) * st;
  
  vec2 drift = vec2(uTime * 0.005);

  float time = uTime * 0.025;

  vec2 r = vec2(
    fbm(vec3(st - drift + vec2(1.7, 9.2), uPhase*25. + time)),
    fbm(vec3(st - drift + vec2(8.2, 1.3), uPhase*25. + time))
  );

  float f = fbm(vec3(st + r - drift, uPhase*25. + time)) * uTurbulence;

  vec2 offset = (f * 2. + (r * uTurbulence));

  vec4 color = texture(uTexture, uv + offset * dist);
  ${Y("color")}
}
`,vertexShader:he,crossorigin:"Anonymous",depthTest:!1,texturesOptions:{floatingPoint:Z},uniforms:{amplitude:{name:"uAmplitude",type:"1f",value:.5},turbulence:{name:"uTurbulence",type:"1f",value:.5},frequency:{name:"uFrequency",type:"1f",value:.2},phase:{name:"uPhase",type:"1f",value:0},time:{name:"uTime",type:"1f",value:1},angle:{name:"uAngle",type:"1f",value:0},easing:{name:"uEasing",type:"1i",value:0},mixRadius:{name:"uMixRadius",type:"1f",value:1},pos:{name:"uPos",type:"2f",value:new T(.5)},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const Lt=`#version 300 es
  precision mediump float;
  in vec3 aVertexPosition;
  in vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  out vec3 vVertexPosition;
  out vec2 vTextureCoord;

  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uFalloff;
  uniform vec2 uPos;
  uniform int uEasing;
  uniform vec2 uPreviousMousePos;
  uniform float uTime;
  uniform float uMixRadius;
  ${X}
  ${K}

  void main() {	
    vec2 aspectRatio = vec2(uResolution.x/uResolution.y, 1);
    float freq = uFrequency * 50.;
    vec3 vertexPosition = aVertexPosition * 0.5;
    vec2 pos = uPos + mix(vec2(0), uMousePos - 0.5, uTrackMouse);
    float dist = length((vertexPosition.xy) * aspectRatio - (pos - 0.5) * aspectRatio);
    float easeDist = max(0.,1. - dist - (1. - uMixRadius));
    //float strength = uAmplitude * 0.1 * smoothstep(0., 0.05, length(uMousePos - uPreviousMousePos));
    float strength = uAmplitude * 0.1;

    float wave = sin(ease(uEasing, dist) * freq - uTime * 0.05) * strength;
    vertexPosition = vertexPosition + normalize(vertexPosition + vec3(1.-pos - 0.5, 0)) * wave * easeDist;
    vertexPosition.z = wave * easeDist;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

    vTextureCoord = aTextureCoord;
    vVertexPosition = vertexPosition;
  }
`,Ut={fragmentShader:`#version 300 es
  precision mediump float;

  in vec3 vVertexPosition;
  in vec2 vTextureCoord;

  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uAmplitude;
  uniform float uFrequency;
  uniform float uFalloff;
  uniform int uEasing;
  uniform vec2 uPos;
  ${X}

  out vec4 fragColor;

  vec2 perspectiveUV(vec2 uv) {
    float aspectRatio = uResolution.x/uResolution.y;
    vec2 centeredUV = uv - 0.5;
    centeredUV.x *= aspectRatio;
    float strength = 1.0 + vVertexPosition.z * 2.;
    vec2 perspectiveUV = centeredUV / strength;
    perspectiveUV.x /= aspectRatio;
    perspectiveUV += 0.5;
    return perspectiveUV;
  }

  void main() {
    // Normalize texture coordinates
    vec2 uv = vVertexPosition.xy + 0.5;
    uv = perspectiveUV(uv);
    
    vec4 color = texture(uTexture, uv);

    // Set the output color
    ${Y("color")};
  }
`,vertexShader:Lt,crossorigin:"Anonymous",widthSegments:250,heightSegments:250,texturesOptions:{floatingPoint:Z},uniforms:{frequency:{name:"uFrequency",type:"1f",value:.5},amplitude:{name:"uAmplitude",type:"1f",value:.5},pos:{name:"uPos",type:"2f",value:new T(.5)},phase:{name:"phase",type:"1f",value:0},time:{name:"uTime",type:"1f",value:0},easing:{name:"uEasing",type:"1i",value:0},previousMousePos:{name:"uPreviousMousePos",type:"2f",value:new T(.5)},mixRadius:{name:"uMixRadius",type:"1f",value:1},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const Vt=`#version 300 es
  precision mediump float;
  in vec3 aVertexPosition;
  in vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;

  out vec3 vVertexPosition;
  out vec2 vTextureCoord;

  uniform float uFrequency;
  uniform float uAmplitude;
  uniform float uRotation;
  uniform float uTime;
  uniform float uFalloff;
  uniform int uEasing;
  uniform vec2 uPos;
  ${X}
  ${K}

  //https://gist.github.com/ayamflow/c06bc0c8a64f985dd431bd0ac5b557cd
  vec2 rotateUV(vec2 uv, float rotation)
  {
      float mid = 0.5;
      return vec2(
          cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
          cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
      );
  }

  const float PI = 3.141592;

  void main() {	
    vec3 vertexPosition = aVertexPosition;
    vec2 waveCoord = vec2(vertexPosition.xy);
    float angle = (uRotation * 360.) * 3.1415926 / 180.;
    float thirdPI = PI * 0.3333;
    float time = uTime*0.25;
    float frequency = 20.0 * uFrequency;
    float dist = 1.-distance(uPos, aTextureCoord);
    dist = max(0., dist);
    float amp = uAmplitude * 0.2;
    amp = mix(amp, amp * ease(uEasing, dist), uFalloff);
    
    float waveX = sin((waveCoord.y + uPos.y) * frequency + (time * thirdPI)) * amp;
    float waveY = sin((waveCoord.x - uPos.x) * frequency + (time * thirdPI)) * amp;
    waveCoord.xy += vec2(mix(waveX, 0., uRotation), mix(0., waveY, uRotation));

    if(vertexPosition.x == 1.) {
        waveCoord.x = 1.;
    }
    if(vertexPosition.x == -1.) {
        waveCoord.x = -1.;
    }
    if(vertexPosition.y == 1.) {
        waveCoord.y = 1.;
    }
    if(vertexPosition.y == -1.) {
        waveCoord.y = -1.;
    }

    gl_Position = uPMatrix * uMVMatrix * vec4(vec3(waveCoord, 0.), 1.0);

    vTextureCoord = aTextureCoord;
    vVertexPosition = vertexPosition;
  }
`,Nt={fragmentShader:`#version 300 es
  precision mediump float;

  in vec2 vTextureCoord;
  
  uniform sampler2D uTexture;
  ${X}
  
  out vec4 fragColor;

  void main()
  {	
    vec2 uv = vTextureCoord;
    vec4 color = texture(uTexture, uv);
    ${Y("color")}
  }
`,vertexShader:Vt,crossorigin:"Anonymous",widthSegments:250,heightSegments:250,texturesOptions:{floatingPoint:Z,premultiplyAlpha:!0,samper:"uTexture"},uniforms:{frequency:{name:"uFrequency",type:"1f",value:.5},amplitude:{name:"uAmplitude",type:"1f",value:.3},falloff:{name:"uFalloff",type:"1f",value:.5},rotation:{name:"uRotation",type:"1f",value:0},time:{name:"uTime",type:"1f",value:0},easing:{name:"uEasing",type:"1i",value:0},pos:{name:"uPos",type:"2f",value:new T(.5)},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const Bt=`#version 300 es
  precision mediump float;
  in vec3 aVertexPosition;
  in vec2 aTextureCoord;
  uniform mat4 uMVMatrix;
  uniform mat4 uPMatrix;
  uniform mat4 uTextureMatrix;

  out vec3 vVertexPosition;
  out vec2 vTextureCoord;

  uniform float uTime;
  uniform float uPhase;
  uniform float uAngle;
  uniform float uFrequency;
  uniform float uTurbulence;
  uniform float uDirection;
  uniform vec2 uPos;
  ${X}
  ${Ct}

  const float PI = 3.14159265359;
  mat2 rot(float a) {
    return mat2(cos(a),-sin(a),sin(a),cos(a));
  }
  
  void main()
  {	
    vec3 vertexPosition = aVertexPosition;
    vec2 textureCoord = (vertexPosition.xy+1.) / 2.;
    
    vec2 pos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
    vec2 st = vec2(textureCoord.x * uResolution.x/uResolution.y, textureCoord.y) - pos;
    st = rot(uAngle * -1. * 2.0 * PI) * (st);
    vec4 noise = bccNoiseDerivatives_XYBeforeZ(vec3((st) * vec2(uDirection, 1. - uDirection) * 9. * uFrequency, uPhase + uTime/40.));
    st.xy = mix(textureCoord, (noise.xy/7. + 0.5), uTurbulence);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);
    
    vTextureCoord = (uTextureMatrix * vec4(st, 0.0, 1.0)).xy;
    vVertexPosition = vec3(aTextureCoord, 0.);
  }
`,Wt={fragmentShader:`#version 300 es
  precision mediump float;
  in vec2 vTextureCoord;
  in vec3 vVertexPosition;

  uniform sampler2D uTexture;
  uniform float uMixRadius;
  uniform vec2 uPos;
  uniform int uEasing;
  ${X}
  ${K}

  out vec4 fragColor;

  void main() {
    vec2 noise = vTextureCoord;
    vec2 uv = vVertexPosition.xy;
    float aspectRatio = uResolution.x/uResolution.y;

    vec2 mPos = uPos + mix(vec2(0), (uMousePos-0.5), uTrackMouse);
    vec2 pos = uMixRadius == 1. ? mPos : uPos;
    float dist = ease(uEasing, max(0.,1.-distance(uv * vec2(aspectRatio, 1), mPos * vec2(aspectRatio, 1)) * 4. * (1. - uMixRadius)));

    uv = mix(uv, noise, dist);

    vec4 color = texture(uTexture, uv);
    ${Y("color")}
  }
`,vertexShader:Bt,widthSegments:250,heightSegments:250,crossorigin:"Anonymous",depthTest:!1,texturesOptions:{floatingPoint:Z,premultiplyAlpha:!0},uniforms:{turbulence:{name:"uTurbulence",type:"1f",value:.5},frequency:{name:"uFrequency",type:"1f",value:.2},direction:{name:"uDirection",type:"1f",value:.5},phase:{name:"uPhase",type:"1f",value:0},angle:{name:"uAngle",type:"1f",value:0},easing:{name:"uEasing",type:"1i",value:0},mixRadius:{name:"uMixRadius",type:"1f",value:1},pos:{name:"uPos",type:"2f",value:new T(.5)},time:{name:"uTime",type:"1f",value:1},...q}};new T(.5),Object.keys(j).map((n,e)=>n.split("_").join(" ").toLowerCase());const Ht={fragmentShader:`#version 300 es
precision mediump float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;

uniform sampler2D uBgTexture;
uniform sampler2D uTexture;
uniform vec2 uMousePos;
uniform vec2 uResolution;
uniform float uOpacity;
uniform float uAxisTilt;
uniform int uSampleBg;
uniform float uTrackMouse;

vec2 perspectiveUV(vec2 uv) {
  float aspectRatio = uResolution.x/uResolution.y;
  float len = 1.-length(uv - 0.5);
  float depth = ((vVertexPosition.z + 0.25) - len * 0.333);
  uv -= vec2(0.5);
  uv.x *= aspectRatio;
  uv *= 1.0 + (depth * uAxisTilt);
  uv.x /= aspectRatio;
  uv += vec2(0.5);
  return uv;
}

out vec4 fragColor;

void main() {
  vec2 pos = mix(vec2(0), (uMousePos - 0.5), uTrackMouse);
  vec2 uv = perspectiveUV(vTextureCoord) - pos;
  vec4 color = texture(uTexture, uv);
  vec4 background = uSampleBg == 1 ? texture(uBgTexture, vTextureCoord) : vec4(0);
  
  color = mix(background, color, color.a * uOpacity);
  fragColor = color/(color.a + 0.0000000000001);
}
`,vertexShader:Ee,crossorigin:"Anonymous",texturesOptions:{floatingPoint:"none",premultiplyAlpha:!0},uniforms:{opacity:{name:"uOpacity",type:"1f",value:1},mousePos:{name:"uMousePos",type:"2f",value:new T(.5)},trackMouse:{name:"uTrackMouse",type:"1f",value:0},axisTilt:{name:"uAxisTilt",type:"1f",value:0},resolution:{name:"uResolution",type:"2f",value:new T(1080,1080)},sampleBg:{name:"uSampleBg",type:"1i",value:1}}},Xt={fragmentShader:`#version 300 es
precision mediump float;
in vec2 vTextureCoord;
in vec3 vVertexPosition;

uniform vec2 uResolution;
uniform vec2 uMousePos;
uniform sampler2D uBgTexture;
uniform sampler2D uMaskTexture;
uniform sampler2D uTexture;
uniform float uOpacity;
uniform int uBlendMode;
uniform float uBgDisplace;
uniform float uDisplace;
uniform float uDispersion;
uniform float uTrackMouse;
uniform float uAxisTilt;
uniform int uSampleBg;
uniform float uMask;

${At}

const float STEPS = 24.0;
const float PI = 3.1415926;

vec3 chromaticAbberation(vec2 st, float angle, float amount, float blend) {
  float aspectRatio = uResolution.x/uResolution.y;
  float rotation = angle * 360.0 * PI / 180.0;
  vec2 aberrated = amount * vec2(0.1 * sin(rotation) * aspectRatio, 0.1 * cos(rotation));
  aberrated *= distance(st, vec2(0.5)) * 2.0;

  vec4 red = vec4(0);
  vec4 blue = vec4(0);
  vec4 green = vec4(0);

  float invSteps = 1.0 / STEPS;
  float invStepsHalf = invSteps * 0.5;

  for(float i = 1.0; i <= STEPS; i++) {
    vec2 offset = aberrated * (i * invSteps);
    red += texture(uBgTexture, st - offset) * invSteps;
    blue += texture(uBgTexture, st + offset) * invSteps;
    green += texture(uBgTexture, st - offset * 0.5) * invStepsHalf;
    green += texture(uBgTexture, st + offset * 0.5) * invStepsHalf;
  }

  return vec3(red.r, green.g, blue.b);
}

vec3 refrakt(vec3 eyeVector, vec3 normal, float iorRatio) {
  float dotProduct = dot(eyeVector, normal);
  float k = 1.0 - iorRatio * iorRatio * (1.0 - dotProduct * dotProduct);
  
  // Handle total internal reflection
  if (k < 0.0) {
    // Calculate reflection instead
    return reflect(eyeVector, normal);
  } else {
    // Calculate refraction
    return iorRatio * eyeVector - (iorRatio * dotProduct + sqrt(k)) * normal;
  }
}

vec4 displacement (vec2 st, vec4 bg, vec4 color) {
  if(uBgDisplace == 1.0) {
    vec2 refraction = refrakt(vec3(vTextureCoord, 0.5), color.rgb, uDisplace-0.5).xy;
    vec2 displaced = vTextureCoord + mix(vec2(0), refraction * 0.1, uDisplace);
    vec4 bgDisp = texture(uBgTexture, displaced);
    bgDisp.rgb = uDispersion == 1.0 ? chromaticAbberation(displaced, atan(displaced.y, displaced.x)-0.25, uDisplace*0.4, 1.0) : bgDisp.rgb;
    return bgDisp * color.a;
  } else {
    vec2 normal = vec2(bg.r * 2.0 - 1.0, bg.g * 2.0 - 1.0) * 0.1; // Convert the color range from [0, 1] to [-1, 1]
    if(uMask == 1.) {
      return texture(uMaskTexture, st + normal * uDisplace) * texture(uTexture, st + normal * uDisplace).a;
    } else {
      return texture(uTexture, st + normal * uDisplace);
    }
  }
}

vec2 perspectiveUV(vec2 uv) {
  float aspectRatio = uResolution.x/uResolution.y;
  vec2 centeredUV = uv - 0.5;
  centeredUV.x *= aspectRatio;
  float strength = 1.0 + (vVertexPosition.z * uAxisTilt);
  vec2 perspectiveUV = centeredUV / strength;
  perspectiveUV.x /= aspectRatio;
  perspectiveUV += 0.5;
  return perspectiveUV;
}

out vec4 fragColor;

void main() {
  vec2 uv = vTextureCoord;
  vec2 pos = mix(vec2(0), (uMousePos - 0.5), uTrackMouse);
  uv = perspectiveUV(uv) - pos;
  vec4 maskColor = texture(uMaskTexture, vTextureCoord);
  vec4 base = texture(uTexture, uv);
  vec4 background = uSampleBg == 1 ? texture(uBgTexture, vTextureCoord) : vec4(0);
  vec4 color = base;

  if (uMask == 1.) {
    color = maskColor * color.a;
  }

  if (uDisplace > 0.) {
    if(uMask == 1.) {
      color = displacement(uv, background, uBgDisplace == 1. ? color : maskColor);
    } else {
      color = displacement(uv, background, color);
    }
  }

  if (uBlendMode > 0) {
    color.rgb = blend(uBlendMode, color.rgb, background.rgb) * color.a;
  }

  // if (uMask == 1.) {
  //   background = vec4(0);
  // }

  color = mix(background, color, color.a * uOpacity);
  fragColor = color.a > 0.0000001 ? (color / color.a) : color;
}
`,vertexShader:Ee,crossorigin:"Anonymous",texturesOptions:{floatingPoint:"none",premultiplyAlpha:!0},uniforms:{dispersion:{name:"uDispersion",type:"1f",value:0},displace:{name:"uDisplace",type:"1f",value:0},bgDisplace:{name:"uBgDisplace",type:"1f",value:0},resolution:{name:"uResolution",type:"2f",value:new T(1080,1080)},mousePos:{name:"uMousePos",type:"2f",value:new T(.5)},opacity:{name:"uOpacity",type:"1f",value:1},trackMouse:{name:"uTrackMouse",type:"1f",value:0},axisTilt:{name:"uAxisTilt",type:"1f",value:0},mask:{name:"uMask",type:"1f",value:0},sampleBg:{name:"uSampleBg",type:"1i",value:1},blendMode:{name:"uBlendMode",type:"1i",value:0}}};(function(n){var e={};function t(i){if(e[i])return e[i].exports;var s=e[i]={i,l:!1,exports:{}};return n[i].call(s.exports,s,s.exports,t),s.l=!0,s.exports}t.m=n,t.c=e,t.d=function(i,s,r){t.o(i,s)||Object.defineProperty(i,s,{enumerable:!0,get:r})},t.r=function(i){typeof Symbol<"u"&&Symbol.toStringTag&&Object.defineProperty(i,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(i,"__esModule",{value:!0})},t.t=function(i,s){if(1&s&&(i=t(i)),8&s||4&s&&typeof i=="object"&&i&&i.__esModule)return i;var r=Object.create(null);if(t.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:i}),2&s&&typeof i!="string")for(var a in i)t.d(r,a,function(o){return i[o]}.bind(null,a));return r},t.n=function(i){var s=i&&i.__esModule?function(){return i.default}:function(){return i};return t.d(s,"a",s),s},t.o=function(i,s){return Object.prototype.hasOwnProperty.call(i,s)},t.p="",t(t.s=0)})([function(n,e,t){var i=this&&this.__spreadArray||function(o,l){for(var h=0,c=l.length,u=o.length;h<c;h++,u++)o[u]=l[h];return o};Object.defineProperty(e,"__esModule",{value:!0}),e.ConicalGradient=void 0;var s=t(1);function r(o,l,h,c,u,d,f){l===void 0&&(l=[[0,"#fff"],[1,"#fff"]]),h===void 0&&(h=0),c===void 0&&(c=0),u===void 0&&(u=0),d===void 0&&(d=2*Math.PI),f===void 0&&(f=!1);var _=Math.floor(180*u/Math.PI),x=Math.ceil(180*d/Math.PI),P=document.createElement("canvas");P.width=o.canvas.width,P.height=o.canvas.height;var v=P.getContext("2d"),m=[[0,0],[o.canvas.width,0],[o.canvas.width,o.canvas.height],[0,o.canvas.height]],g=Math.max.apply(Math,m.map(function(C){var E=C[0],M=C[1];return Math.sqrt(Math.pow(E-h,2)+Math.pow(M-c,2))}))+10;v.translate(h,c);for(var b=2*Math.PI*(g+20)/360,R=new s.default(l,x-_+1),w=_;w<=x;w++)v.save(),v.rotate((f?-1:1)*(Math.PI*w)/180),v.beginPath(),v.moveTo(0,0),v.lineTo(g,-2*b),v.lineTo(g,0),v.fillStyle=R.getColor(w-_),v.fill(),v.closePath(),v.restore();var S=document.createElement("canvas");S.width=o.canvas.width,S.height=o.canvas.height;var k=S.getContext("2d");return k.beginPath(),k.arc(h,c,g,u,d,f),k.lineTo(h,c),k.closePath(),k.fillStyle=k.createPattern(P,"no-repeat"),k.fill(),o.createPattern(S,"no-repeat")}e.default=r,CanvasRenderingContext2D.prototype.createConicalGradient=function(){for(var o=[],l=0;l<arguments.length;l++)o[l]=arguments[l];var h=this,c={stops:[],addColorStop:function(u,d){this.stops.push([u,d])},get pattern(){return r.apply(void 0,i([h,this.stops],o))}};return c};var a=t(2);Object.defineProperty(e,"ConicalGradient",{enumerable:!0,get:function(){return a.ConicalGradient}})},function(n,e,t){Object.defineProperty(e,"__esModule",{value:!0});var i=function(){function s(r,a){r===void 0&&(r=[]),a===void 0&&(a=100);var o=document.createElement("canvas");o.width=a,o.height=1,this.ctx=o.getContext("2d");for(var l=this.ctx.createLinearGradient(0,0,a,0),h=0,c=r;h<c.length;h++){var u=c[h];l.addColorStop.apply(l,u)}this.ctx.fillStyle=l,this.ctx.fillRect(0,0,a,1),this.rgbaSet=this.ctx.getImageData(0,0,a,1).data}return s.prototype.getColor=function(r){var a=this.rgbaSet.slice(4*r,4*r+4);return"rgba("+a[0]+", "+a[1]+", "+a[2]+", "+a[3]/255+")"},s}();e.default=i},function(n,e,t){Object.defineProperty(e,"__esModule",{value:!0})}]);const Gt=(n,e,t,i,s)=>{var r=Math.PI/180*s,a=Math.cos(r),o=Math.sin(r),l=a*(t-n)+o*(i-e)+n,h=a*(i-e)-o*(t-n)+e;return[+l.toFixed(1),+h.toFixed(1)]},J=(n,e)=>{const t=e||1,i=Math.min(...n.map(h=>h[0])),s=Math.max(...n.map(h=>h[0])),r=Math.min(...n.map(h=>h[1])),a=Math.max(...n.map(h=>h[1])),o=Math.abs(s-i),l=Math.abs(a-r);return{width:Math.round(o/t),height:Math.round(l/t),aspectRatio:o/t/(l/t),center:{x:Math.round((o/2+i)/t),y:Math.round((l/2+r)/t)},corners:[[i,r],[s,r],[s,a],[i,a]]}},Ae=(n,e,t)=>{let i;const s=J(t);if(e.fill.length>1){let r=e.gradientAngle?+e.gradientAngle*2*Math.PI:0,a=s.center.x,o=s.center.y;if(e.gradientType==="radial"&&(i=n.createRadialGradient(a,o,Math.max(s.width,s.height)*.7,a,o,0)),e.gradientType==="linear"&&(i=n.createLinearGradient(a-Math.cos(r)*s.width/2,o-Math.sin(r)*s.height/2,a+Math.cos(r)*s.width/2,o+Math.sin(r)*s.height/2)),e.gradientType==="conic"){i=n.createConicalGradient(a,o,-Math.PI+r,Math.PI+r);const l=[...e.fill,...e.fill.slice().reverse()];l.forEach((c,u)=>{i.addColorStop(u*(1/(l.length-1)),c)}),document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGMatrix(),i=i.pattern}else e.fill.forEach((l,h)=>{i.addColorStop(h*(1/(e.fill.length-1)),l)})}else i=e.fill[0];return i};let ce,ue;typeof document.hidden<"u"?(ce="hidden",ue="visibilitychange"):typeof document.msHidden<"u"?(ce="msHidden",ue="msvisibilitychange"):typeof document.webkitHidden<"u"&&(ce="webkitHidden",ue="webkitvisibilitychange");function B(n){return n&&typeof n=="string"&&(n=JSON.parse(n)),Object.values(n)}function Ce(n,e,t){for(let i=0;i<t;i++)n=(n+e)/2;return+((n+e)/2).toFixed(2)}function jt(n){const e=J(n.coords),t=n.getPositionOffset();let i=n.coords.map(([s,r])=>Gt(e.center.x,e.center.y,s,r,-n.rotation*360));return i=i.map(([s,r])=>[Math.round(s+t.x),Math.round(r+t.y)]),i}function te(n,e){const t=n[0]/n[1],i=Math.sqrt(t*(3e5*(e||1)));return[i,i/t]}function ke(){return/Android|iPhone/i.test(navigator.userAgent)}function ie(n){const e=n.trackMouse&&n.trackMouse>0;let t=n.layerType==="effect"&&n.compiledFragmentShaders&&n.compiledFragmentShaders.filter(s=>s.match(/uMousePos/g)&&s.match(/uMousePos/g).length>1).length,i=n.layerType==="effect"&&n.animating;return e||t||i}function qt(n,e,t){const i=[];return n.forEach(s=>{switch(s.layerType){case"text":i.push(new ii(s,e,null,t).unpackage());break;case"image":i.push(new ti(s,e,t).unpackage());break;case"fill":i.push(new De(s,e,t).unpackage());break;case"draw":i.push(new Jt(s,e,t).unpackage());break;case"shape":i.push(new ei(s,e,t).unpackage());break;case"effect":i.push(new De(s,e,t).unpackage());break}}),i}function Yt(n){n.forEach(e=>{if(e.fontCSS&&e.fontCSS.src){let t=e.fontCSS.src.includes(".otf")?"otf":!1,i=e.fontCSS.src.includes(".tff")?"tff":!1;const s=document.createElement("link");s.rel="preload",s.href=e.fontCSS.src,s.as="font",s.type=`font/${t||i||"otf"}`,s.crossOrigin="anonymous",document.head.appendChild(s)}})}function $t(n,e){if(n.length){const t=document.createElement("style");for(let i=0;i<n.length;i++){let s=["normal","regular"].includes(n[i].fontStyle)?"":`:wght@${n[i].fontStyle}`;n[i].fontStyle==="italic"&&(s=""),n[i].fontCSS?t.innerHTML+=`
        @font-face {
          font-family: '${n[i].fontCSS.family}';
          src: url('${n[i].fontCSS.src}');
          font-display: swap;
        }`:t.innerHTML+=`@import url(https://fonts.googleapis.com/css2?family=${n[i].fontFamily.split(" ").join("+")}${s});`}document.head.appendChild(t)}}function Qt(n,e){const i=te([e.offsetWidth||n.width,e.offsetHeight||n.height])[0]/e.offsetWidth,s=n.getPositionOffset(),r=document.createElement("div");r.setAttribute("data-us-text","loading"),r.setAttribute("data-us-project",n.local.projectId),r.style.width=n.width/i+"px",r.style.height=n.height/i+"px",r.style.top=s.y/i+e.offsetTop+"px",r.style.left=s.x/i+e.offsetLeft+"px",r.style.fontSize=n.fontSize/i+"px",r.style.lineHeight=n.lineHeight/i+"px",r.style.letterSpacing=n.letterSpacing/i+"px",r.style.fontFamily=n.fontFamily,r.style.fontWeight=n.fontWeight,r.style.textAlign=n.textAlign,r.style.wordBreak="break-word",r.style.transform=`rotateZ(${Math.round(n.rotation*360)}deg)`,r.style.color=n.fill[0],r.style.zIndex=2,r.innerText=n.textContent,e.appendChild(r)}let se;function Zt(){L.forEach((n,e)=>{document.body.contains(n.element)||(n.curtain.dispose(),L.splice(e,1))})}function de(){cancelAnimationFrame(se);const n=L.filter(t=>t.getAnimatingEffects().length),e=t=>{const i=n.filter(s=>re(s.element));L.forEach(s=>{s.rendering=i.includes(s)}),i.length?(ni(),i.forEach(s=>{s.curtain&&t-s.lastTime>=s.frameDuration&&(oi(),s.curtain.render(),s.lastTime=t)}),se=requestAnimationFrame(e)):cancelAnimationFrame(se)};n.length&&(se=requestAnimationFrame(e))}function Kt(n,e){return new Promise(t=>{const i=setInterval(()=>{n.local[e]&&(clearInterval(i),t())},20)})}class Ie{constructor(e,t){N(this,"local",{id:"",projectId:""});this.visible=e.visible!==void 0?e.visible:!e.hidden||!0,this.locked=e.locked||!1,this.aspectRatio=e.aspectRatio||1,this.local.projectId=t,this.local.id=wt()}state(){return L.find(e=>e.projectId===this.local.projectId)||this.initOptions}getIndex(){return this.state().history.map(e=>e.local.id).indexOf(this.local.id)}getPlane(){return this.state().curtain.planes.find(e=>e.userData.id===this.local.id)}getPlanes(){return this.state().curtain.planes.filter(e=>e.userData.id===this.local.id)}getMaskedItem(){return this.mask?this.state().history.filter(e=>e.visible&&!e.parentLayer)[this.getIndex()-1]:!1}getChildEffectItems(){return this.effects?this.state().history.filter(e=>e.visible&&e.parentLayer&&this.effects.includes(e.parentLayer)):[]}}let fe=class extends Ie{constructor(t,i,s){super(t,i);N(this,"isElement",!0);this.initOptions=s,this.opacity=t.opacity||1,this.displace=t.displace||0,this.trackMouse=t.trackMouse||0,this.axisTilt=t.axisTilt||0,this.bgDisplace=t.bgDisplace||0,this.dispersion=t.dispersion||0,this.blendMode=t.blendMode||"NORMAL"}createLocalCanvas(){const t=this.state(),i=document.createElement("canvas"),s=+t.dpi*t.scale;i.width=t.element.offsetWidth*s,i.height=t.element.offsetHeight*s;const a=te([t.element.offsetWidth,t.element.offsetHeight])[0]/t.element.offsetWidth,o=i.getContext("2d");o.scale(s/a,s/a),this.local.canvas=i,this.local.ctx=o}resize(){const t=this.state();if(this.local.canvas){const i=+t.dpi*t.scale,r=te([t.element.offsetWidth,t.element.offsetHeight])[0]/t.element.offsetWidth;this.local.canvas.width=t.canvasWidth,this.local.canvas.height=t.canvasHeight,this.local.ctx.scale(i/r,i/r)}}getPositionOffset(){const t=this.state(),i=t.canvasWidth/t.canvasHeight,s=this.aspectRatio/i,r=t.canvasWidth*Math.sqrt(s),a=t.canvasHeight/Math.sqrt(s),l=te([t.element.offsetWidth,t.element.offsetHeight])[0]/t.element.offsetWidth;let h=(t.canvasWidth*l-r*l)/(t.dpi*2),c=(t.canvasHeight*l-a*l)/(t.dpi*2);this.layerType==="image"&&(h+=r*l/(t.dpi*2),c+=a*l/(t.dpi*2));let u=this.translateX+h,d=this.translateY+c;return{x:u,y:d,offX:h,offY:c}}};class Jt extends fe{constructor(t,i,s){super(t,i);N(this,"layerType","draw");this.initOptions=s;let r=this.default(t||{});for(let a in r)this[a]=r[a];Object.keys(t).length&&this.createLocalCanvas()}default(t){return{displace:t.displace||0,bgDisplace:t.bgDisplace||0,dispersion:t.dispersion||0,blendMode:"NORMAL",opacity:t.opacity||1,type:t.type||"circle",mask:t.mask||!1,brushRotation:t.brushRotation||t.rotation||0,coords:t.coords||[],effects:t.effects||[],gradientAngle:t.gradientAngle||t.gradAngle||0,gradientType:t.gradientType||t.gradType||"linear",fill:t.fill||["#777777"],rotateHue:t.rotateHue||t.huerotate||!1,rotation:t.rotation||0,lerp:t.lerp||!0,size:t.size||100,translateX:t.translateX||0,translateY:t.translateY||0}}unpackage(){return this.coords=B(this.coords),this.fill=B(this.fill),this.effects=B(this.effects),this.coords.length>3?this.coordsHiRes=we(this.coords,this.size):this.coordsHiRes=this.coords,this}interpolatePath(){this.coordsHiRes=we(this.coords,this.size)}render(){const t=this.state().getScaleFactor(this.aspectRatio);let i=this.lerp?this.coordsHiRes||this.coords:this.coords;this.local.ctx.clearRect(0,0,this.state().canvasWidth,this.state().canvasHeight);const s=this.getPositionOffset(),r=i.length;this.local.ctx.beginPath();for(let a=0;a<r;a++){let o=i[a][0]*t.x+s.x,l=i[a][1]*t.y+s.y;a===0?this.local.ctx.moveTo(o,l):this.local.ctx.lineTo(o,l)}this.local.ctx.lineJoin="round",this.local.ctx.lineCap="round",this.local.ctx.strokeStyle=this.fill[0],this.local.ctx.lineWidth=this.size,this.local.ctx.stroke()}}class ei extends fe{constructor(t,i,s){super(t,i);N(this,"layerType","shape");N(this,"isElement",!0);this.initOptions=s;let r=this.default(t||{});for(let a in r)this[a]=r[a];Object.keys(t).length&&(this.createLocalCanvas(),this.render())}default(t){return{blendMode:t.blendMode||"NORMAL",borderRadius:t.borderRadius||0,coords:t.coords||[],displace:t.displace||0,dispersion:t.dispersion||0,bgDisplace:t.bgDisplace||0,effects:t.effects||[],fill:t.fill||["#777777"],gradientAngle:t.gradientAngle||t.gradAngle||0,gradientType:t.gradientType||t.gradType||"linear",mask:t.mask||0,numSides:t.numSides||3,opacity:t.opacity||1,rotation:t.rotation||0,translateX:t.translateX||0,translateY:t.translateY||0,type:t.type||"rectangle"}}unpackage(){return this.fill=B(this.fill),this.coords=B(this.coords),this.effects=B(this.effects),this}render(){let t=jt(this);if(this.local.ctx.beginPath(),this.type==="rectangle"){const i=J(this.coords);let s=this.borderRadius*Math.min(i.width,i.height)/2;const r=(o,l,h)=>{const c=Math.cos(h),u=Math.sin(h);return[o*c-l*u,o*u+l*c]},a=this.rotation*2*Math.PI;if(t.length){this.local.ctx.beginPath();let o=this.coords[0][0]<this.coords[1][0],l=this.coords[0][1]>this.coords[2][1],h=[-1,1,-1,1];o&&(h=[-1,-1,-1,-1]),l&&(h=[1,1,1,1]),o&&l&&(h=[1,-1,1,-1]);for(let c=0;c<t.length;c++){const[u,d]=t[c],[f,_]=t[(c+1)%t.length],x=(c+1)*Math.PI/2+a,[P,v]=r(s,0,x);let m=h[c];this.local.ctx.lineTo(u-P*m,d-v*m),this.local.ctx.arcTo(u,d,f,_,s)}this.local.ctx.closePath(),this.local.ctx.stroke()}}else if(this.type==="circle"){let i=J(t);const s=J(this.coords);this.local.ctx.ellipse(i.center.x,i.center.y,s.width/2,s.height/2,this.rotation*Math.PI*2,0,2*Math.PI)}else if(this.type==="polygon"){const i=this.numSides;if(console.log(i),t.length>=2){const s=J(t),r=J(this.coords),a=this.coords[0][1]>this.coords[2][1],o=s.center.y,l=s.center.x,h=(f,_,x,P,v)=>{const m=Math.cos(x),g=Math.sin(x);f-=P,_-=v;const b=f*m-_*g,R=f*g+_*m;return f=b+P,_=R+v,[f,_]},c=(this.rotation+(a?.5:0))*2*Math.PI,u=r.width/Math.sqrt(3)*.86,d=r.height/Math.sqrt(3)*.86;this.local.ctx.beginPath();for(let f=0;f<i;f++){const x=-Math.PI/2+2*Math.PI*f/i;let P=l+u*Math.cos(x),v=o+d*Math.sin(x);[P,v]=h(P,v,c,l,o),f===0?this.local.ctx.moveTo(P,v):this.local.ctx.lineTo(P,v)}this.local.ctx.closePath()}}this.local.ctx.fillStyle=Ae(this.local.ctx,this,t),this.local.ctx.clearRect(0,0,this.state().canvasWidth,this.state().canvasHeight),this.local.ctx.fill()}}class De extends Ie{constructor(t,i,s){super(t,i);N(this,"layerType","effect");this.initOptions=s,this.type=t.type||"sine",this.type==="ungulate"&&(this.type="noise");for(let r in t)r!=="local"&&(this[r]=t[r]);this.effects=[],this.data=t.data||{},this.parentLayer=t.parentLayer||!1,this.animating=t.animating||!1,this.isMask=t.isMask||0,this.compiledFragmentShaders=t.compiledFragmentShaders||[],this.compiledVertexShaders=t.compiledVertexShaders||[]}unpackage(){this.type==="blur"&&this.type,this.type==="smoothBlur"&&(this.type="blur"),this.type==="ungulate"&&(this.type="noise");for(let t in this)this[t].type==="Vec2"?this[t]=new T(this[t]._x,this[t]._y):this[t].type==="Vec3"&&(this[t]=new A(this[t]._x,this[t]._y,this[t]._z));return this}getParent(){return this.state().history.filter(t=>t.effects&&t.effects.length).find(t=>t.effects.includes(this.parentLayer))}}class ti extends fe{constructor(t,i,s){super(t,i);N(this,"layerType","image");N(this,"isElement",!0);this.initOptions=s;let r=this.default(t||{});for(let a in r)this[a]=r[a];Object.keys(t).length&&(this.createLocalCanvas(),this.loadImage())}default(t){return{bgDisplace:t.bgDisplace||0,dispersion:t.dispersion||0,effects:t.effects||[],size:t.size||.25,rotation:t.rotation||t.angle||0,height:t.height||50,displace:t.displace||0,repeat:t.repeat||0,mask:t.mask||0,rotation:t.rotation||0,scaleX:t.scaleX||1,scaleY:t.scaleY||1,src:t.src||"",speed:t.speed||.5,thumb:t.thumb||"",translateX:t.translateX||0,translateY:t.translateY||0,width:t.width||50}}unpackage(){return this.effects=B(this.effects),this}loadImage(){const t=new Image,i=new Image;t.crossOrigin="Anonymous",i.crossOrigin="Anonymous",t.addEventListener("load",()=>{this.local.loaded=!0,this.local.fullyLoaded=!0,this.local.img=t,this.width=t.width,this.height=t.height,this.render=this.renderImage,this.render(),this.getPlane()&&this.getPlane().textures.filter(s=>s.sourceType==="canvas").forEach(s=>{s.shouldUpdate=!1,this.rendering||(s.needUpdate(),this.state().curtain.render())})},!1),i.addEventListener("load",()=>{this.local.loaded||(this.local.loaded=!0,this.local.img=i,this.width=i.width,this.height=i.height,this.render=this.renderImage,this.render())},!1),t.src=this.src,i.src=this.thumb}getRelativeScale(){const t=this.state(),s=te([t.element.offsetWidth,t.element.offsetHeight])[0]/t.element.offsetWidth;return Math.min(t.element.offsetWidth*s*2/this.width,t.element.offsetHeight*s*2/this.height)}renderImage(){const t=this.getPositionOffset(),i=t.x,s=t.y,r=this.rotation*360*(Math.PI/180),a=this.getRelativeScale();let o=this.width*a*this.scaleX,l=this.height*a*this.scaleY;this.local.ctx.clearRect(0,0,this.state().canvasWidth,this.state().canvasHeight),this.local.ctx.save(),this.local.ctx.translate(i,s),this.local.ctx.rotate(r),this.local.ctx.scale(this.size,this.size),this.local.ctx.drawImage(this.local.img,-o/2,-l/2,o,l),this.local.ctx.restore()}render(){}}class ii extends fe{constructor(t,i,s,r){super(t,i);N(this,"layerType","text");N(this,"isElement",!0);N(this,"justCreated",!1);this.initOptions=r;let a=this.default(t||{});for(let o in a)this[o]=a[o];if(this.isSafari=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),Qt(this,r.element),Object.keys(t).length&&(this.createLocalCanvas(),requestAnimationFrame(()=>{this.coords=[[-2,0],[-2+this.width,0],[-2+this.width,0+this.height],[-2,0+this.height]]})),s)this.local.loaded=!0,this.render(),this.state().renderNFrames(2),this.getPlane()&&this.getPlane().textures.filter(o=>o.sourceType==="canvas").forEach(o=>{o.needUpdate()});else{const o=new FontFace(this.fontFamily,`url(${this.fontCSS.src})`,{style:this.fontStyle.includes("italic")?"italic":"normal",weight:isNaN(parseInt(this.fontStyle))?400:parseInt(this.fontStyle)});document.fonts.add(o),o.load().then(()=>{this.local.loaded=!0,this.render(),this.state().renderNFrames(2),this.getPlane()&&this.getPlane().textures.filter(l=>l.sourceType==="canvas").forEach(l=>{l.needUpdate()})})}}default(t){return{bgDisplace:t.bgDisplace||0,dispersion:t.dispersion||0,effects:t.effects||[],fill:t.fill||["#ffffff"],highlight:t.highlight||["transparent"],fontSize:t.fontSize||24,fontCSS:t.fontCSS||null,lineHeight:t.lineHeight||25,letterSpacing:t.letterSpacing||0,mask:t.mask||0,fontFamily:t.fontFamily||"arial",fontStyle:t.fontStyle||"normal",fontWeight:t.fontWeight||"normal",textAlign:t.textAlign||"left",textContent:t.textContent||"",gradientAngle:t.gradientAngle||t.gradAngle||0,gradientType:t.gradientType||t.gradType||"linear",coords:t.coords||[],rotation:t.rotation||0,translateX:t.translateX||0,translateY:t.translateY||0,width:t.width||200,height:t.height||50}}unpackage(){return this.fill=B(this.fill),this.highlight=B(this.highlight),this.coords=B(this.coords),this.effects=B(this.effects),this}render(){const t=this.getPositionOffset();let i=t.x,s=t.y,r=0,a=this.width,o=this.height,l=this.fontSize>0?this.fontSize:0,h=this.lineHeight>0?this.lineHeight:0,c=this.fontStyle.includes("italic")?"italic":"normal",u="400";this.local.textBoxPos={x:i,y:s},this.local.ctx.clearRect(0,0,this.state().canvasWidth,this.state().canvasHeight),this.local.ctx.font=`${c} ${u} ${l}px/${h}px ${this.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial`,this.isSafari||(this.local.ctx.textAlign=this.textAlign,this.local.ctx.letterSpacing=this.letterSpacing+"px");const d=this.local.ctx.measureText("m").width;a=Math.max(a,d),this.local.ctx.save(),this.local.ctx.translate(i+a/2,s+o/2),this.local.ctx.rotate(this.rotation*360*Math.PI/180),this.local.ctx.translate(-(i+a/2),-(s+o/2)),this.textAlign==="center"&&(i+=a/2),this.textAlign==="right"&&(i+=a),this.local.ctx.fillStyle=Ae(this.local.ctx,this,this.coords);const f=(m,g,b,R,w,S,k)=>{let C=g.split("").reduce((M,D,G)=>M+m.measureText(D).width+(G<g.length-1?w:0),0),E;if(S==="center"?E=b+(k-C)/2-k/2:E=b,S==="right")for(let M=g.length-1;M>=0;M--){const D=g[M];E-=m.measureText(D).width,m.fillText(D,E,R),M>0&&(E-=w)}else for(let M=0;M<g.length;M++)m.fillText(g[M],E,R),E+=m.measureText(g[M]).width+w},_=(m,g)=>{let b=s+h*g+h/2+l/3;this.isSafari&&this.letterSpacing?f(this.local.ctx,m,i,b,this.letterSpacing,this.textAlign,a):this.local.ctx.fillText(m,i,b)},x=this.textContent?this.textContent.split(`
`):[""];let P=x.length;const v=(m,g,b)=>g.split("").reduce((w,S,k)=>(w+=m.measureText(S).width,k<g.length-1&&(w+=b),w),0);for(let m=0;m<P;m++){let g="",b=x[m].split(/(\s|\n)/);for(let R=0;R<b.length;R++){const w=b[R],S=g+w;if((this.isSafari&&this.letterSpacing?v(this.local.ctx,S,this.letterSpacing):this.local.ctx.measureText(S).width)>a||w===`
`){if(g!=="")x[m]=g.trim(),R!==b.length-1?(x.splice(m+1,0,b.slice(R).join("")),P++):w!==`
`&&x.push(w);else{let C=w,E=m;for(;C.length>0;){let M="";for(let D=0;D<C.length&&(this.local.ctx.measureText(M+C[D]).width<=a||D==0);D++)M+=C[D];C=C.slice(M.length),x[E]=M.trim(),C.length>0&&(x.splice(E+1,0,C),E++,P++)}b.slice(R+1).length>0&&(x[E]+=b.slice(R+1).join(""))}break}else g=S;R===b.length-1&&(x[m]=g.trim())}}x.forEach((m,g)=>{_(m,r),g<x.length-1&&r++}),this.local.ctx.translate(-(i+a/2),-(s+o/2)),this.local.ctx.restore(),this.height=this.lineHeight*r+this.lineHeight}}function si(){document[ce]?cancelAnimationFrame(se):de()}function ri(){L.forEach(n=>{n.initialized&&re(n.element)&&n.resize()})}function re(n){const e=n.getBoundingClientRect(),t=window.innerHeight||document.documentElement.clientHeight,i=window.innerWidth||document.documentElement.clientWidth;return e.top<t&&e.bottom>0&&e.left<i&&e.right>0}let ze=window.scrollY;function ai(n){const e=L.filter(i=>i.getAnimatingEffects().length),t=L.filter(i=>i.rendering);e.length&&!t.length&&de(),t.length&&t.forEach(i=>{i.mouse.movePos.y+=(window.scrollY-ze)/2}),ze=window.scrollY}function ni(){L.forEach(n=>{re(n.element)&&n.curtain.planes.find(e=>e.uniforms.mousePos)&&(ke()&&n.interactivity&&n.interactivity.mouse&&n.interactivity.mouse.disableMobile||(n.interactivity.mouse.momentum?(n.mouse.pos.x=Ce(n.mouse.movePos.x,n.mouse.lastPos.x,n.interactivity.mouse.momentum*2),n.mouse.pos.y=Ce(n.mouse.movePos.y,n.mouse.lastPos.y,n.interactivity.mouse.momentum*2)):(n.mouse.pos.x=n.mouse.movePos.x,n.mouse.pos.y=n.mouse.movePos.y),n.mouse.lastPos.x=n.mouse.pos.x,n.mouse.lastPos.y=n.mouse.pos.y))})}function Oe(n){L.filter(e=>re(e.curtain.container)).forEach(e=>{let t=e.curtain.container.getBoundingClientRect(),i,s;n.targetTouches?(i=n.targetTouches[0].clientX,s=n.targetTouches[0].clientY):(i=n.clientX,s=n.clientY);const r={x:t.left/2,y:t.top/2},a=i/2-r.x,o=s/2-r.y;e.mouse.movePos.x=a,e.mouse.movePos.y=o})}function oi(){L.filter(n=>re(n.element)&&n.mouse.recordTrail).forEach(n=>{n.mouse.trail.unshift([n.mouse.pos.x/(n.element.offsetWidth*.5),1-n.mouse.pos.y/(n.element.offsetHeight*.5)]),n.mouse.trail.length>100&&n.mouse.trail.pop()})}const L=[];class li{constructor(e){this.canvasWidth=e.width||e.element.offsetWidth||window.innerWidth,this.canvasHeight=e.height||e.element.offsetHeight||window.innerHeight,this.curtain=void 0,this.curtainRafId=void 0,this.dpi=+e.dpi||Math.min(1.5,window.devicePixelRatio),this.element=e.element,this.fps=e.fps||60,this.frameDuration=Math.floor(1e3/(e.fps||60)),this.history=e.history,this.initialized=!1,this.lasTick=null,this.lastTime=0,this.rendering=!1,this.projectId=e.projectId,this.interactivity={mouse:{momentum:1.1,disableMobile:!1},scroll:{momentum:1.1,disableMobile:!1}},this.loading=!0,this.mouse={downPos:{x:0,y:0},movePos:{x:window.innerWidth/4,y:window.innerHeight/4},lastPos:{x:window.innerWidth/4,y:window.innerHeight/4},delta:{x:0,y:0},dragging:!1,trail:[],recordTrail:!1,pos:{x:window.innerWidth/2,y:window.innerHeight/2}},this.renderingScale=e.renderingScale||1,this.scale=e.scale||1,this.size="Square",this.split=!1,this.versionId="",e.width&&e.height&&(this.element.style.width=e.width+"px",this.element.style.height=e.height+"px"),this.createCurtains(),this.setCanvasScale()}setCanvasScale(){this.canvasWidth=this.element.offsetWidth*this.dpi*this.scale,this.canvasHeight=this.element.offsetHeight*this.dpi*this.scale}resize(){this.setCanvasScale(),this.history.filter(e=>e.isElement).forEach(e=>{e.resize(),e.getPlane()&&e.getPlane().textures.filter(t=>t.sourceType==="canvas").forEach(t=>{t.needUpdate()})}),this.history.filter(e=>e.render).forEach(e=>{e.render()}),this.curtain.resize()}getScaleFactor(e){return{x:Math.sqrt(this.canvasWidth/this.canvasHeight/e),y:Math.sqrt(this.canvasHeight/this.canvasWidth*e)}}getAnimatingEffects(){return this.history.filter(e=>ie(e)&&e.visible)}createCurtains(){const e=new qe({container:this.element,premultipliedAlpha:!0,antialias:!1,autoRender:!1,autoResize:!1,watchScroll:!1,renderingScale:Math.min(Math.max(.25,this.renderingScale),1),production:!0,pixelRatio:this.dpi});document.querySelectorAll(`[data-us-text="loading"][data-us-project="${this.projectId}"]`).forEach(t=>{t.style.position="absolute"}),this.curtain=e}fullRedraw(){this.fullRedrawEnabled=!0,this.curtain.render(),this.fullRedrawEnabled=!1}renderNFrames(e,t){let i=0;const s=()=>{this.curtain.render(),i<e?(i++,requestAnimationFrame(s)):t&&t()};this.rendering||s()}setInteractiveParams(e,t){let i={mouse:{momentum:1.1,disableMobile:!1},scroll:{momentum:1.1,disableMobile:!1}};t&&t.mouse&&("momentum"in t.mouse&&(i.mouse.momentum=t.mouse.momentum),"disableMobile"in t.mouse&&(i.mouse.disableMobile=t.mouse.disableMobile)),e&&e.interactivity&&e.interactivity.mouse&&("momentum"in e.interactivity.mouse&&(i.mouse.momentum=e.interactivity.mouse.momentum),"disableMobile"in e.interactivity.mouse&&(i.mouse.disableMobile=e.interactivity.mouse.disableMobile)),this.interactivity=i}getSplitOrderedItems(){let e=this.getOrderedItems(),t=0,i=e[t];if(i){let s=i.parentLayer?i.getParent():null,r=s&&ie(s),a=s&&s.effects&&s.effects.length&&s.getChildEffectItems().filter(o=>ie(o)).length;for(;i&&!ie(i)&&!r&&!a;)t++,i=e[t],i&&(s=i.parentLayer?i.getParent():null,r=s&&ie(s),a=s&&s.effects&&s.effects.length&&s.getChildEffectItems().filter(o=>ie(o)).length);return{static:this.getOrderedItems().splice(0,t),dynamic:this.getOrderedItems().splice(t)}}else return{static:[],dynamic:[]}}initializePlanes(e){this.initializing=!0,this.handleItemPlanes(()=>{document.querySelectorAll(`[data-us-text="loading"][data-us-project="${this.projectId}"]`).forEach(t=>{t.style.color="transparent"}),this.handlePlaneCreation(),e&&e(this)})}getPassPlane(e,t){return this.curtain.planes.find(i=>i.userData.id===e.local.id&&i.userData.passIndex===t)}getRenderTargets(){return this.curtain.renderTargets.filter(e=>e.userData.id)}getPlanes(){return this.curtain.planes.filter(e=>e.type!=="PingPongPlane")}removeUnusedPlanes(){this.curtain.planes.forEach(e=>{e.remove()}),this.curtain.renderTargets.forEach(e=>{e.remove()})}createPlane(e,t,i){let s=Xt;if(e.displace===0&&e.blendMode==="NORMAL"&&!e.mask&&(s=Ht),!e.isElement){let a=["noise","noiseField","sine","ripple"].includes(e.type)?250:1;s={crossOrigin:"",fragmentShader:e.compiledFragmentShaders[i?i.index:0],vertexShader:e.compiledVertexShaders[i?i.index:0],widthSegments:a,heightSegments:a,texturesOptions:{floatingPoint:"half-float",premultiplyAlpha:!0},uniforms:{resolution:{name:"uResolution",type:"2f",value:new T(this.canvasWidth,this.canvasHeight)},mousePos:{name:"uMousePos",type:"2f",value:new T(.5)},time:{name:"uTime",type:"1f",value:0}}}}const r=new be(this.curtain,this.curtain.container,s);return r.textures.length=0,r.userData.id=e.local.id,r.userData.layerType=e.layerType,r.userData.type=e.type,r.setRenderOrder(t),r}createPingPongPlane(e,t,i){const s=new Pt(this.curtain,this.curtain.container,It),r=e.getParent();if(s)return s.userData.id=e.local.id,s.setRenderOrder(t),this.setInitialEffectPlaneUniforms(s,e,r,i),s.onReady(()=>{s.userData.isReady=!0}).onRender(()=>this.setEffectPlaneUniforms(s,e)),s}createEffectPlane(e,t,i){const s=this.createPlane(e,t,i),r=e.getParent();s&&(i&&(s.userData.passIndex=i.index,s.userData.downSample=i.downSample,s.userData.length=e.data.passes.length,Object.entries(i).forEach(([a,o])=>{s.uniforms[a]&&(s.uniforms[a].value=o)})),this.setInitialEffectPlaneUniforms(s,e,r,i),s.onReady(()=>{s.userData.isReady=!0}).onRender(()=>this.setEffectPlaneUniforms(s,e)))}createElementPlane(e,t){const i=this.createPlane(e,t);i&&i.onReady(()=>{i.userData.isReady=!0}).onRender(()=>{i.uniforms.mousePos.value.x=this.mouse.pos.x/(this.element.offsetWidth*.5),i.uniforms.mousePos.value.y=1-this.mouse.pos.y/(this.element.offsetHeight*.5),i.userData.isReady||(i.uniforms.opacity.value=e.visible?e.opacity:0,i.uniforms.trackMouse.value=e.trackMouse||0,i.uniforms.axisTilt&&(i.uniforms.axisTilt.value=e.axisTilt||0),i.uniforms.resolution.value.x=this.curtain.canvas.width,i.uniforms.resolution.value.y=this.curtain.canvas.height,i.uniforms.displace&&(i.uniforms.displace.value=e.displace,i.uniforms.bgDisplace.value=e.bgDisplace,i.uniforms.dispersion.value=e.dispersion),i.uniforms.blendMode&&(i.uniforms.blendMode.value=Object.keys(Tt).indexOf(e.blendMode)),i.uniforms.mask&&"mask"in e&&(i.uniforms.mask.value=e.mask),i.renderOrder===0?i.uniforms.sampleBg.value=0:i.uniforms.sampleBg.value=1)})}handleEffectPlane(e,t,i){const s="passIndex"in i?this.getPassPlane(e,i.passIndex):e.getPlane();let r=this.getRenderTargets()[t-1],a=this.curtain.planes.find(l=>l.type==="PingPongPlane"&&l.userData.id===e.local.id);a&&s&&s.createTexture({sampler:"uPingPongTexture",fromTexture:a.getTexture()}),r&&s&&s.createTexture({sampler:"uTexture",fromTexture:r.getTexture()}),i.passIndex>0&&s&&this.getRenderTargets()[t-(1+i.passIndex)]&&s.createTexture({sampler:"uBgTexture",fromTexture:this.getRenderTargets()[t-(1+i.passIndex)].getTexture()});const o=e.texture||e.data.texture;o&&(s.userData.textureLoaded=!1,s.loadImage(o.src,{sampler:o.sampler},l=>{s.userData.textureLoaded=!0,this.curtain.render()}))}handleElementPlane(e,t){const i=e.getPlane(),s=e.getChildEffectItems();let r=this.getRenderTargets()[t-1];if(s.length||(i.textures.length=0),r&&s.length&&i?i.createTexture({sampler:"uTexture",premultipliedAlpha:!0,fromTexture:r.getTexture()}):i&&i.loadCanvas(e.local.canvas,{premultipliedAlpha:!0,sampler:"uTexture"}),r){let a=s.length+1,o=s.reduce((c,u)=>c+u.getPlanes().length,0),l=this.getPlanes()[t-a],h=l?this.history.find(c=>c.local.id===l.userData.id):null;if(e.mask){const c=r.getTexture();if(e.effects.length){const u=e.getChildEffectItems().filter(d=>!d.isMask).reduce((d,f)=>d+f.getPlanes().length,0);r=this.getRenderTargets()[t-(1+u)]}i.createTexture({sampler:"uMaskTexture",premultipliedAlpha:!0,fromTexture:h.isElement?c:r.getTexture()})}if(e.mask){let c=h.getPlanes().length+h.getChildEffectItems().reduce((u,d)=>u+d.getPlanes().length,0);h.getMaskedItem()&&(c+=h.getMaskedItem().getPlanes().length),h.getPlanes().filter(u=>u.type==="PingPongPlane").length&&c--,r=this.getRenderTargets()[t-(1+c+o)]}else r=this.getRenderTargets()[t-(1+o)];r&&i.createTexture({sampler:"uBgTexture",premultipliedAlpha:!0,fromTexture:r.getTexture()})}}handleChildEffectPlane(e,t,i){const s="passIndex"in i?this.getPassPlane(e,i.passIndex):e.getPlane(),r=e.getParent();let a=this.getRenderTargets()[t-1],o=r.effects.filter(d=>{if(this.history.find(f=>f.parentLayer===d))return this.history.find(f=>f.parentLayer===d).visible}),l=o.indexOf(e.parentLayer),h=o.at(-1)===o[l],c=i.passIndex===i.length;e.type==="custom"&&s.createTexture({sampler:"uBgTexture",premultipliedAlpha:!0,fromTexture:this.getRenderTargets()[t]}),s&&a&&(l||i.passIndex>0)?(s.createTexture({sampler:"uTexture",premultipliedAlpha:!0,fromTexture:a.getTexture()}),e.isMask&&(!i.length||h&&c)&&s.loadCanvas(r.local.canvas,{premultipliedAlpha:!0,sampler:"uMaskTexture"})):s&&e.isMask?(h&&c&&s.loadCanvas(r.local.canvas,{premultipliedAlpha:!0,sampler:"uMaskTexture"}),a&&s.createTexture({sampler:"uTexture",premultipliedAlpha:!0,fromTexture:a.getTexture()})):s&&s.loadCanvas(r.local.canvas,{premultipliedAlpha:!0,sampler:"uTexture"});const u=e.texture||e.data.texture;u&&(s.userData.textureLoaded=!1,s.loadImage(u.src,{sampler:u.sampler},d=>{s.userData.textureLoaded=!0,this.curtain.render()}))}createPlanes(){this.getOrderedItems().forEach((e,t)=>{e.getPlanes().length?e.getPlanes().forEach(i=>i.setRenderOrder(t)):e.isElement?this.createElementPlane(e,t):this.createEffectPlanes(e,t)})}createEffectPlanes(e,t){const i=e.data;i.passes&&i.passes.length?(this.createEffectPlane(e,t,{index:0,length:i.passes.length+1,downSample:i.downSample}),i.passes.forEach((s,r)=>{this.createEffectPlane(e,t,{index:r+1,length:i.passes.length+1,downSample:s.downSample,[s.prop]:s.value})})):(this.createEffectPlane(e,t),e.type==="mouse"&&this.createPingPongPlane(e,t))}createTextures(){const e=this.getPlanes().filter(i=>i.visible).sort((i,s)=>i.renderOrder-s.renderOrder),t=e.length;for(let i=0;i<t;i++){const s=e[i];let r=this.history.find(a=>a.local.id===s.userData.id);i<t-1&&this.assignRenderTargetToPlane(e,i,r,s),this.handleTextures(r,i,s.userData)}}assignRenderTargetToPlane(e,t,i,s){let r=this.getTextureParams(e,t,i),a=this.getRenderTargets()[t]||new ge(this.curtain,r);a.userData.id=s.userData.id,s.setRenderTarget(a)}handleTextures(e,t,i){e.isElement?this.handleElementPlane(e,t):e.parentLayer?this.handleChildEffectPlane(e,t,i):this.handleEffectPlane(e,t,i)}handleItemPlanes(e,t){t&&this.handleArgs(t),this.createPlanes(),this.createTextures(),this.checkIfReady(e)}isNotReady(e){const t=this.history.find(o=>o.local.id===e.userData.id),i=t.layerType==="image"&&!t.local.loaded,s=t.layerType==="text"&&!t.local.loaded,r="textureLoaded"in e.userData&&!e.userData.textureLoaded;return(this.split?i||s||r:!1)||!e.userData.isReady}checkIfReady(e){const t=()=>{this.curtain.planes.filter(i=>this.isNotReady(i)).length?(this.curtain.render(),requestAnimationFrame(t)):e()};t()}setInitialEffectPlaneUniforms(e,t,i,s){if(!e.userData.initialUniformsSet||!e.userData.isReady){for(let r in e.uniforms)r in t&&(e.uniforms[r].value=t[r]);i&&s&&s.index<s.length-1&&e.uniforms.isMask&&(e.uniforms.isMask.value=0),e.userData.initialUniformsSet=!0}}setEffectPlaneUniforms(e,t){if(t.animating&&e.uniforms.time&&(e.uniforms.time.value+=(t.speed||1)*60/this.fps),e.uniforms.mousePos&&(e.uniforms.mousePos.value.x=this.mouse.pos.x/(this.element.offsetWidth*.5),e.uniforms.mousePos.value.y=1-this.mouse.pos.y/(this.element.offsetHeight*.5)),e.uniforms.previousMousePos&&this.mouse.trail.length>3){let i=this.mouse.trail.at(3);e.uniforms.previousMousePos.value.x=i[0],e.uniforms.previousMousePos.value.y=i[1]}e.uniforms.resolution.value.x=this.curtain.canvas.width,e.uniforms.resolution.value.y=this.curtain.canvas.height}isHiddenFirstChildEffect(e){return e.parentLayer&&e.getParent().effects.length>1?e.getParent().effects.indexOf(e.parentLayer)===0:!1}removeRenderTargets(){this.getRenderTargets().forEach(e=>e.remove())}clearAllTextures(){this.getPlanes().forEach(e=>e.textures.length=0)}handleArgs(e){(e.reorder||e.changed&&this.isHiddenFirstChildEffect(e.changed))&&(this.removeRenderTargets(),this.clearAllTextures()),e.changed&&this.isHiddenFirstChildEffect(e.changed)&&this.clearAllTextures()}getOrderedItems(){let e=[];return this.history.filter(t=>!t.parentLayer&&t.visible).forEach(t=>{t.effects&&t.effects.length&&e.push(...t.getChildEffectItems()),e.push(t)}),e}getTextureParams(e,t,i){const s={maxWidth:this.curtain.canvas.width,maxHeight:this.curtain.canvas.height},r=e[t],a=e[t+1]?this.history.find(l=>l.local.id===e[t+1].userData.id):null;return(r.userData.downSample||a&&!a.parentLayer&&a.type==="pixelate"||a&&!a.parentLayer&&a.type==="diffuse"||i.type==="blur"||i.type==="bokeh"||i.type==="bloom"||i.type==="pixelate")&&(s.maxWidth=this.canvasWidth,s.maxHeight=this.canvasHeight,!r.uniforms.final||r.uniforms.final.value<1),s}cloneCanvas(e){const t=document.createElement("canvas");t.width=e.width,t.height=e.height;const i=t.getContext("2d"),s=this.scale;return i.scale(s,s),i.drawImage(e,0,0),t}handlePlaneCreation(){this.history.filter(e=>e.isElement).forEach(e=>{e.render(),e.getPlane()&&e.getPlane().textures.filter(t=>t.sourceType==="canvas").forEach(t=>{t.shouldUpdate=!1,t.needUpdate()})}),this.initialized=!0,this.initializing=!1,this.rendering||(this.fullRedraw(),this.renderNFrames(2)),this.removePlanes(),this.curtain.setPixelRatio(Math.min(Math.min(this.dpi||1.5,2),this.dpi)),de()}async removePlanes(){const e=this.getSplitOrderedItems();e.dynamic.length||e.static.pop();for(const t of e.static){const i=t.layerType==="text"&&!t.local.loaded,s=t.layerType==="image"&&!t.local.fullyLoaded;(i||s)&&await Kt(t,i?"loaded":"fullyLoaded");const r=t.getPlanes();for(const a of r)a.uuid!==r.at(-1).uuid&&a.remove()}}}function hi(n){return typeof HTMLElement=="object"?n instanceof HTMLElement:n&&typeof n=="object"&&n!==null&&n.nodeType===1&&typeof n.nodeName=="string"}function ci(){window.addEventListener("mousemove",Oe),window.addEventListener("touchmove",Oe),window.addEventListener("scroll",ai),window.addEventListener("routeChange",Zt),ke()||window.addEventListener("resize",ri),document.addEventListener(ue,si,!1)}function ui(n,e,t){return te([n.offsetWidth,n.offsetHeight])[0]/n.offsetWidth,{canvasWidth:n.offsetWidth*t,canvasHeight:n.offsetHeight*t,scale:e,dpi:t,element:n}}function Fe(n){let e=n.projectId.split("?")[0],t=n.projectId.split("?")[1];return new Promise((i,s)=>{fetch(`https://firebasestorage.googleapis.com/v0/b/embeds.unicorn.studio/o/${e}?alt=media${t?`&update=${t}`:""}`).then(r=>r.json()).then(r=>{const a=r.options||{},o=hi(n.element)?n.element:document.getElementById(n.elementId);if(!o){s(new Error(`Couldn't find an element with id '${n.elementId}' on the page.`));return}const l=qt(r.history,e,ui(o,n.scale||a.scale||1,n.dpi||Math.min(1.5,window.devicePixelRatio)));Yt(l.filter(c=>c.layerType==="text")),$t(l.filter(c=>c.layerType==="text"));const h=new li({fps:n.fps||a.fps||60,dpi:n.dpi,projectId:e,renderingScale:n.scale||a.scale||1,element:o,width:n.width,height:n.height});L.push(h),h.history=l,h.mouse.recordTrail=h.history.find(c=>c.type=="mouse"),h.setInteractiveParams(n,a),h.initializePlanes(i)}).catch(r=>{console.log(r),s(r)})})}function di(){return new Promise((n,e)=>{const t=document.querySelectorAll("[data-us-project]");[...t].filter(i=>!i.getAttribute("data-us-initialized")).forEach((i,s)=>{const r=i.getAttribute("data-us-project"),a=i.getAttribute("data-us-dpi"),o=i.getAttribute("data-us-scale"),l=i.getAttribute("data-us-fps"),h=i.getAttribute("data-us-disableMobile");i.setAttribute("data-us-initialized",!0),Fe({projectId:r,element:i,dpi:+a,scale:+o,fps:+l,interactivity:h?{mouse:{disableMobile:!0}}:null}).then(c=>{s===t.length-1&&(de(),n(L))})})})}ci(),F.addScene=Fe,F.init=di,Object.defineProperty(F,Symbol.toStringTag,{value:"Module"})});
