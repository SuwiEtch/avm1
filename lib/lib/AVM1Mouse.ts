/**
 * Copyright 2014 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { alCallProperty } from '../runtime';
import { AVM1Context } from '../context';
import { wrapAVM1NativeClass } from './AVM1Utils';
import { AVM1Object } from '../runtime/AVM1Object';
import { AVM1Stage } from './AVM1Stage';
import { AVM1Globals } from './AVM1Globals';
import { AVMStage } from '@awayfl/swf-loader';

export class AVM1Mouse extends AVM1Object {
	public static createAVM1Class(context: AVM1Context): AVM1Object {
		const wrapped = wrapAVM1NativeClass(context, false, AVM1Mouse, ['show', 'hide'], []);
		return wrapped;
	}

	public static mouseDownDelegate: any=null;
	public static mouseMoveDelegate: any=null;
	public static mouseOutDelegate: any=null;
	public static mouseUpDelegate: any=null;

	public static bindStage(context: AVM1Context, cls: AVM1Object, avmStage: AVMStage, htmlElement: HTMLElement): void {

		if (AVM1Mouse.mouseDownDelegate)
			avmStage.removeEventListener('mouseDown', AVM1Mouse.mouseDownDelegate);
		if (AVM1Mouse.mouseMoveDelegate)
			avmStage.removeEventListener('mouseMove', AVM1Mouse.mouseMoveDelegate);
		if (AVM1Mouse.mouseOutDelegate)
			avmStage.removeEventListener('mouseOut', AVM1Mouse.mouseOutDelegate);
		if (AVM1Mouse.mouseUpDelegate)
			avmStage.removeEventListener('mouseUp', AVM1Mouse.mouseUpDelegate);

		AVM1Mouse.mouseDownDelegate = (e)=>{
			alCallProperty(cls, 'broadcastMessage', ['onMouseDown']);
		};
		AVM1Mouse.mouseMoveDelegate = (e)=>{
			alCallProperty(cls, 'broadcastMessage', ['onMouseMove']);
		};
		AVM1Mouse.mouseOutDelegate = (e)=>{
			alCallProperty(cls, 'broadcastMessage', ['onMouseOut']);
		};
		AVM1Mouse.mouseUpDelegate = (e)=>{
			alCallProperty(cls, 'broadcastMessage', ['onMouseUp']);
		};
		avmStage.addEventListener('mouseDown', AVM1Mouse.mouseDownDelegate);
		avmStage.addEventListener('mouseMove', AVM1Mouse.mouseMoveDelegate);
		avmStage.addEventListener('mouseOut', AVM1Mouse.mouseOutDelegate);
		avmStage.addEventListener('mouseUp', AVM1Mouse.mouseUpDelegate);
	}

	public static hide() {
		(<AVM1Stage>AVM1Globals.instance.Stage).avmStage.scene.mouseManager.showCursor = false;
	}

	public static show() {
		(<AVM1Stage>AVM1Globals.instance.Stage).avmStage.scene.mouseManager.showCursor = true;
	}
}
