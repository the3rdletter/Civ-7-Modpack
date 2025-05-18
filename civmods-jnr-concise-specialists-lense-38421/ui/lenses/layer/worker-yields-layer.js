import LensManager from '/core/ui/lenses/lens-manager.js';
import PlotWorkersManager, { PlotWorkersUpdatedEventName } from '/base-standard/ui/plot-workers/plot-workers-manager.js';

const WorkerYieldsLensLayer = LensManager.layers.get('fxs-worker-yields-layer');
WorkerYieldsLensLayer.updateWorkablePlot = function (info){
	if (info.IsBlocked) {
		const location = GameplayMap.getLocationFromIndex(info.PlotIndex);
		this.yieldSpriteGrid.addSprite(location, "city_special_base", this.blockedSpecialistSpriteOffset, { scale: this.plotSpriteScale });
		this.yieldSpriteGrid.addText(location, info.NumWorkers.toString(), this.blockedSpecialistSpriteOffset, {
			fonts: ["TitleFont"],
			fontSize: this.specialistFontSize,
			faceCamera: true
		});
	}
	else {
		const yieldsToAdd = [];
		const maintenancesToAdd = [];
		let netFood = 0;
		let netHappiness = 0;
		let netYieldSum = 0;

		info.NextYields.forEach((yieldNum, i) => {
			netYieldSum = netYieldSum + yieldNum - info.CurrentYields[i];
			if (GameInfo.Yields[i].YieldType == "YIELD_FOOD") {
				netFood = netFood + yieldNum - info.CurrentYields[i];
			}
			else if (GameInfo.Yields[i].YieldType == "YIELD_HAPPINESS") {
				netHappiness = netHappiness + yieldNum - info.CurrentYields[i];
			}
		});
		info.NextMaintenance.forEach((yieldNum, i) => {
			netYieldSum = netYieldSum - yieldNum + info.CurrentMaintenance[i];
			if (GameInfo.Yields[i].YieldType == "YIELD_FOOD") {
				netFood = netFood - yieldNum + info.CurrentMaintenance[i];
			}
			else if (GameInfo.Yields[i].YieldType == "YIELD_HAPPINESS") {
				netHappiness = netHappiness - yieldNum + info.CurrentMaintenance[i];
			}
		});
		info.NextYields.forEach((yieldNum, i) => {
			if (GameInfo.Yields[i].YieldType == "YIELD_FOOD") {
				const netYieldChange = Math.round((netFood) * 10) / 10;
				if (netYieldChange > 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon(GameInfo.Yields[i].YieldType, netYieldChange);
					yieldsToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}
			else if (GameInfo.Yields[i].YieldType == "YIELD_HAPPINESS") {
				const netYieldChange = Math.round((netHappiness) * 10) / 10;
				if (netYieldChange > 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon(GameInfo.Yields[i].YieldType, netYieldChange);
					yieldsToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}
			else if (GameInfo.Yields[i].YieldType == "YIELD_DIPLOMACY") {
				const netYieldChange = Math.round((yieldNum - info.CurrentYields[i]) * 10) / 10;
				if (netYieldChange != 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon("YIELD_INFLUENCE", netYieldChange);
					yieldsToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}
			else {
			const netYieldChange = Math.round((yieldNum - info.CurrentYields[i]) * 10) / 10;
				if (netYieldChange != 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon(GameInfo.Yields[i].YieldType, netYieldChange);
					yieldsToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}
		});
		info.NextMaintenance.forEach((yieldNum, i) => {
			if (GameInfo.Yields[i].YieldType == "YIELD_FOOD") {
				const netYieldChange = Math.round((netFood) * 10) / 10;
				if (netYieldChange < 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon(GameInfo.Yields[i].YieldType, netYieldChange);
					maintenancesToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}
			else if (GameInfo.Yields[i].YieldType == "YIELD_HAPPINESS") {
				const netYieldChange = Math.round((netHappiness) * 10) / 10;
				if (netYieldChange < 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon(GameInfo.Yields[i].YieldType, netYieldChange);
					maintenancesToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}	
			else {
				const netYieldChange = Math.round((-yieldNum + info.CurrentMaintenance[i]) * 10) / 10;
				if (netYieldChange != 0) {
					const iconURL = PlotWorkersManager.getYieldPillIcon(GameInfo.Yields[i].YieldType, netYieldChange);
					maintenancesToAdd.push({ iconURL: iconURL, yieldDelta: netYieldChange });
				}
			}
		});
		if (netYieldSum >= 10) {
			netYieldSum = Math.round(netYieldSum);
		}
		else {
			netYieldSum = Math.round((netYieldSum) * 10) / 10;
		}
		const iconURL ="hud_mini_lens_btn";
		yieldsToAdd.push({ iconURL: iconURL, yieldDelta: netYieldSum });
		const location = GameplayMap.getLocationFromIndex(info.PlotIndex);
		if (info.NumWorkers) {
			this.yieldSpriteGrid.addSprite(location, "city_special_base", { x: -this.specialistIconXOffset, y: this.specialistIconHeight, z: this.iconZOffset }, { scale: this.plotSpriteScale });
			this.yieldSpriteGrid.addText(location, info.NumWorkers.toString(), { x: -this.specialistIconXOffset, y: this.specialistIconHeight, z: this.iconZOffset }, {
				fonts: ["TitleFont"],
				fontSize: this.specialistFontSize,
				faceCamera: true
			});
		}
		this.yieldSpriteGrid.addSprite(location, "city_special_empty", { x: info.NumWorkers ? this.specialistIconXOffset : 0, y: this.specialistIconHeight, z: this.iconZOffset }, { scale: this.plotSpriteScale });
		// Add yields to sprite grid
		yieldsToAdd.forEach((yieldPillData, i) => {
			const groupWidth = (yieldsToAdd.length - 1) * this.yieldSpritePadding;
			const xPos = (i * this.yieldSpritePadding) + (groupWidth / 2) - groupWidth;
			const yPos = maintenancesToAdd.length > 0 ? 4 : 0;
			if (yieldPillData.iconURL == "hud_mini_lens_btn") {
				this.yieldSpriteGrid.addSprite(location, yieldPillData.iconURL, { x: xPos, y: yPos, z: this.iconZOffset });
				this.yieldSpriteGrid.addText(location, "+" + yieldPillData.yieldDelta.toString(), { x: xPos, y: yPos, z: this.iconZOffset }, {
					fonts: ["TitleFont"],
					fontSize: 4,
					faceCamera: true
				});
			}
			else {
				this.yieldSpriteGrid.addSprite(location, yieldPillData.iconURL, { x: xPos, y: yPos, z: this.iconZOffset });
				this.yieldSpriteGrid.addText(location, "+" + yieldPillData.yieldDelta.toString(), { x: xPos, y: (yPos - 3), z: this.iconZOffset }, {
					fonts: ["TitleFont"],
					fontSize: 4,
					faceCamera: true
				});
			}
		});
		// Add yields to sprite grid
		maintenancesToAdd.forEach((yieldPillData, i) => {
			const groupWidth = (maintenancesToAdd.length - 1) * this.yieldSpritePadding;
			const xPos = (i * this.yieldSpritePadding) + (groupWidth / 2) - groupWidth;
			const yPos = yieldsToAdd.length > 0 ? -16 : 0;
			this.yieldSpriteGrid.addSprite(location, yieldPillData.iconURL, { x: xPos, y: yPos, z: this.iconZOffset });
			this.yieldSpriteGrid.addText(location, yieldPillData.yieldDelta.toString(), { x: xPos, y: (yPos - 3), z: this.iconZOffset }, {
				fonts: ["TitleFont"],
				fontSize: 4,
				faceCamera: true
			});
		});
	}
}
    