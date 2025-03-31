import DialogManager from '/core/ui/dialog-box/manager-dialog-box.js';
import { Catalog } from "/core/ui/utilities/utility-serialize.js";

class AutoRepairMod {
    constructor() {
    	this.catalog = new Catalog("AutoRepairSettings"); // Catalog インスタンスを作成
        this.settingsKey = "modSettings"; // `Catalog` 内の保存キー
        this.settings = {
            EnableAutoRepair: true
        };
        
        this.loadSettings(); // ゲーム起動時に設定をロード
        
        this.init();
        
    }
    
    init() {
        console.warn("MOD: Auto Repair Execution Initialized.");
        engine.on('LocalPlayerTurnBegin', this.onLocalPlayerTurnBegin, this); 
        engine.on('PlayerTurnActivated', this.onPlayerTurnActivated, this);
        this.startPanelObserver();  // パネルの監視を開始
    }
    

    
    // 設定を保存
    saveSettings() {
        const obj = this.catalog.getObject("Settings");
        obj.write(this.settingsKey, JSON.stringify(this.settings));

        if (typeof obj.commit === "function") {
            obj.commit();
        }
        if (typeof obj.flush === "function") {
            obj.flush();
        }
    }

    // 設定をロード
    loadSettings() {
        const obj = this.catalog.getObject("Settings");
        const savedData = obj.read(this.settingsKey);
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                if (typeof parsedData === "object" && parsedData !== null) {
                    this.settings = { ...this.settings, ...parsedData }; // デフォルト値を維持
                } else {
                }
            } catch (e) {
                console.error("[ERROR] Failed to parse configuration data: " + e.message);
            }
        } else {
            console.warn("[WARNING] No settings found, using default value");
        }
    }
    
    
    onLocalPlayerTurnBegin() {
        this.turnActiveFlag = true;
    }

    onPlayerTurnActivated() {	      	  	
        if (!this.turnActiveFlag) return;
        this.turnActiveFlag = false;        

		if (this.settings.EnableAutoRepair) {
	        this.executeRepair();
	    }
    }
    
    executeRepair() {
        const player = Players.get(GameContext.localPlayerID);
        if (!player) return;

        // ターン開始時の所持金を取得し、収入分を加算する
        let playerGoldBalance = Players.Treasury.get(GameContext.localPlayerID)?.goldBalance ?? 0;
        const turnGoldIncome = Players.Treasury.get(GameContext.localPlayerID)?.goldIncome ?? 0;
        playerGoldBalance += turnGoldIncome;
        playerGoldBalance += turnGoldIncome || 0;  // null の可能性を考慮

        player.Cities.getCityIds().forEach(cityId => {
        	const city = Cities.get(cityId);
            if (!city) {
                console.error("[ERROR]AutoRepair: Failed to retrieve city data. CityID: " + JSON.stringify(cityId));
                return;
            }

			// 修理可能な建造物を取得
            const results = Game.CityOperations.canStartQuery(cityId, CityOperationTypes.BUILD, CityQueryType.Constructible);
            if (!results || results.length === 0) return;  // 空ならスキップ
            
            for (let i = 0; i < results.length; i++) {
                const { index, result } = results[i];
                
                if (!result.RepairDamaged) continue;

                const constructible = GameInfo.Constructibles.lookup(index);
                if (!constructible) {
                    console.error("[ERROR]AutoRepair: Constructible not found for index: " + index);
                    return;
                }

                // 建造物リストを取得し、修理可能なものを検索
                const recommendations = this.getCityBuildReccomendations(city);
                const productionItems = this.getProductionItems(city, recommendations, playerGoldBalance, true, false);


                if (!productionItems || productionItems.buildings.length === 0) return;

		        for (const item of productionItems.buildings) {
		            // 所持金が足りない場合はスキップ
		            if (playerGoldBalance < item.cost) {
		                console.warn(`[WARNING]AutoRepair: Not enough gold for ${item.name}. Required: ${item.cost}, Available: ${playerGoldBalance}`);
		                continue;
		            }

		            // 所持金を減算
		            playerGoldBalance -= item.cost;

		            // 修理リクエストの作成
		            const typeInfo = GameInfo.Types.lookup(item.type);
		            if (typeInfo) {
		                let args = { ConstructibleType: typeInfo.Hash };

		                if (item.locations) {
		                    const loc = GameplayMap.getLocationFromIndex(item.locations[0]);
		                    args.X = loc.x;
		                    args.Y = loc.y;
		                }

		                try {
		                    const requestResult = Game.CityCommands.sendRequest(cityId, CityCommandTypes.PURCHASE, args);

		                    if (!requestResult) {
		                        console.error("[ERROR]AutoRepair: sendRequest() returned undefined. CityID: " + JSON.stringify(cityId));
		                    }
		                } catch (error) {
		                    console.error("[ERROR]AutoRepair: Error during sendRequest(). " + error);
		                }
		            }
		        }
            }
        });
    }
    
    getCityBuildReccomendations(city) {
	    if (!city) return [];

	    const recommendationParams = {
	        cityId: city.id,
	        subject: AdvisorySubjectTypes.PRODUCTION,
	        maxReturnedEntries: 0,
	    };

	    return Players.Advisory.get(city.owner)?.getBuildRecommendations(recommendationParams) ?? [];
	}
	
	getProductionItems(city, recommendations, playerGoldBalance, isPurchase, viewHidden) {
	    if (!city) return { buildings: [] };

	    const items = { buildings: [] };

	    const results = Game.CityOperations.canStartQuery(city.id, CityOperationTypes.BUILD, CityQueryType.Constructible);
	    if (!results || results.length === 0) return items;

	    for (const { index, result } of results) {
	        if (!result.RepairDamaged) continue; // 修理対象でない建物はスキップ

	        const constructible = GameInfo.Constructibles.lookup(index);
	        if (!constructible) continue;

	        const cost = result.Cost ?? city.Gold?.getBuildingPurchaseCost(YieldTypes.YIELD_GOLD, constructible.ConstructibleType) ?? 0;
	        if (cost <= 0) continue;

	        items.buildings.push({
	            name: constructible.Name,
	            type: constructible.ConstructibleType,
	            cost,
	            locations: result.Plots ?? [],
	        });
	    }

	    return items;
	}


    
    
    // `panel-sub-system-dock` を監視し、見つかったらボタンを追加
	startPanelObserver() {
	    if (this.panelObserver) {
	        this.panelObserver.disconnect();
	    }

	    this.panelObserver = new MutationObserver(() => {
	        const panelDock = document.querySelector(".sub-system-dock--button-container");
	        
	        if (panelDock && !document.querySelector(".mod-button")) {
	            this.addModButton(panelDock);

	            // 監視を停止
	            this.panelObserver.disconnect();
	        }
	    });

	    this.panelObserver.observe(document.body, { childList: true, subtree: true });
	}

    
    // ボタンが削除されたら監視を再開
	observeButtonRemoval() {
	    const observer = new MutationObserver((mutations, obs) => {
	        const panelDockExists = document.querySelector(".sub-system-dock--button-container");
	        
	        if (!panelDockExists) {
	            obs.disconnect(); // 監視を完全に停止

	            // 一定間隔で `panel-sub-system-dock` の復活をチェック
	            const checkInterval = setInterval(() => {
	                if (document.querySelector(".sub-system-dock--button-container")) {
	                    clearInterval(checkInterval); // 監視を停止
	                    this.startPanelObserver();
	                }
	            }, 1000); // 1秒ごとに確認
	        }
	    });

	    observer.observe(document.body, { childList: true, subtree: true });
	}



    // MOD用のボタンを追加
	addModButton(panelDock = null) {
	    if (document.getElementById("AutoRepairButton")) return; // すでにボタンがあれば追加しない

	    if (!panelDock) {
	        panelDock = document.querySelector(".sub-system-dock--button-container");
	        if (!panelDock) {
	            return;
	        }
	    }

	    if (document.querySelector(".mod-button-container")) {
	        return;
	    }

	    // ボタン全体を包むコンテナ
	    const buttonContainer = document.createElement("div");
	    buttonContainer.classList.add("mod-button-container");
	    buttonContainer.style.position = "relative";
	    buttonContainer.style.display = "inline-flex";
	    buttonContainer.style.alignItems = "center";
	    buttonContainer.style.height = "100%";

		const mainTooltipText = Locale.compose("LOC_MOD_YMD_All_REPAIR");
		
	    // 大きなボタン（メイン機能）
	    const mainButton = document.createElement("fxs-activatable");
	    mainButton.classList.add("ssb__button", "mod-button", "ssb__element", "pointer-events-auto", "cursor-pointer");
	    mainButton.setAttribute("data-tooltip-content", mainTooltipText);
	    mainButton.setAttribute("data-audio-group-ref", "audio-panel-sub-system-dock");
	    mainButton.setAttribute("data-audio-focus-ref", "data-audio-focus-small");
	    mainButton.setAttribute("data-audio-activate-ref", "none");
	    mainButton.setAttribute("data-audio-press-ref", "data-audio-press-small");

	    mainButton.addEventListener("click", () => {
	        this.executeRepair();
	        this.showMessageExec();
	    });

	    const buttonIconBg = document.createElement("div");
	    buttonIconBg.classList.add("ssb__button-iconbg", "mod-button");
	    mainButton.appendChild(buttonIconBg);

	    const buttonIcon = document.createElement("div");
	    buttonIcon.classList.add("ssb__button-icon", "mod-button");
	    buttonIcon.style.backgroundImage = "url(fs://game/base-standard/ui/icons/city_icons/city_repair.png)";
	    mainButton.appendChild(buttonIcon);

	    // CSS を他のボタンと統一
	    mainButton.style.position = "relative";  // 他のボタンと統一
	    mainButton.style.marginTop = "10px";  // 高さ方向のズレを修正
	    mainButton.style.top = "auto";  // 自動調整
	    mainButton.style.display = "flex";  // フレックスボックスを適用
	    mainButton.style.alignItems = "center";  // 中央揃え

		const settingsTooltipText = Locale.compose("LOC_MOD_YMD_REPAIR_SETTINGS");
		
	    // 小さなボタン（設定）
	    const settingsButton = document.createElement("fxs-activatable");
	    settingsButton.classList.add("ssb__button", "mod-settings-button", "pointer-events-auto", "cursor-pointer");
	    settingsButton.setAttribute("data-tooltip-content", settingsTooltipText);
	    settingsButton.style.position = "absolute";
	    settingsButton.style.top = "5px"; // 位置調整
	    settingsButton.style.left = "5px";
	    settingsButton.style.width = "24px";
	    settingsButton.style.height = "24px";
	    settingsButton.style.borderRadius = "50%";

		this.updateSettingsButtonColor(settingsButton);

	    settingsButton.addEventListener("click", (event) => {
	        event.stopPropagation(); // 親ボタンのクリックを防ぐ
	        this.showSettingsDialog();
	    });

	    const settingsIcon = document.createElement("div");
	    settingsIcon.classList.add("ssb__button-icon");
	    settingsIcon.style.width = "100%";
	    settingsIcon.style.height = "100%";
	    settingsButton.appendChild(settingsIcon);

	    // ボタンをコンテナに追加
	    buttonContainer.appendChild(mainButton);
	    buttonContainer.appendChild(settingsButton);

	    // コンテナを `panelDock` に追加
	    panelDock.appendChild(buttonContainer);
	    
	    this.observeButtonRemoval();
	    
	}


	
    // 設定ダイアログの表示
    showSettingsDialog() {
        if (typeof DialogManager === "undefined") {
            return;
        }

        this.loadSettings(); // ダイアログ表示前に最新の設定をロード
        
		const text = Locale.compose("LOC_MOD_YMD_AUTOREPAIR_SETTING_1");
		const titleText = Locale.compose("LOC_MOD_YMD_DIALOG_TITLE");


        // ダイアログのHTML
		const dialogContent = `
		    <div class="dialog-content">
		        <div class="option-checkbox" style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
		            <fxs-checkbox id="EnableAutoRepair" class="fxs-checkbox"></fxs-checkbox>
		            <label for="EnableAutoRepair" class="fxs-label">${text}</label>
		        </div>
		    </div>
		`;

        // ダイアログの作成
        DialogManager.createDialog_Confirm({
            body: dialogContent,
            title: titleText,
            callback: () => {
                setTimeout(() => {
                    const EnableAutoRepairCheckbox = document.getElementById("EnableAutoRepair");

                    if (EnableAutoRepairCheckbox) {
                        // チェックボックスの `selected` 状態を取得
                        this.settings.EnableAutoRepair = EnableAutoRepairCheckbox.getAttribute("selected") === "true";

                        this.saveSettings(); // 設定を保存
                        const settingsButton = document.querySelector(".mod-settings-button");
	                    if (settingsButton) {
	                        this.updateSettingsButtonColor(settingsButton);
	                    }
                    } else {
                        console.error("[ERROR] Failed to get checkboxes.");
                    }
                }, 200); // UI が閉じるタイミングに合わせる
            }
        });

        // ダイアログが開いた後にチェックボックスの状態を設定
		setTimeout(() => {
		    const EnableAutoRepairCheckbox = document.getElementById("EnableAutoRepair");

		    if (EnableAutoRepairCheckbox) {
		        EnableAutoRepairCheckbox.setAttribute("selected", this.settings.EnableAutoRepair ? "true" : "false");
		    } else {
		        console.error("[ERROR] Failed to apply checkbox");
		    }
		}, 500);
    }

	showMessageExec() {
		const text = Locale.compose("LOC_MOD_YMD_REPAIR_EXECUTED");
	    
	    const modText = document.createElement("div");
	    modText.textContent = text;
	    modText.style.cssText = `
		    position: fixed;
		    top: 15%;
		    left: 40%;
		    transform: translate(-50%, -50%);
		    background: rgba(0, 0, 0, 0.5);
		    color: white;
		    padding: 10px;
		    z-index: 1000;
		    font-size: 18px;
		    text-align: center;
		    border-radius: 8px;
		`;

	    document.body.appendChild(modText);
	    
	    setTimeout(() => modText.remove(), 2000); // 3秒後に消える
	}

	updateSettingsButtonColor(settingsButton) {
	    if (this.settings.EnableAutoRepair) {
	        settingsButton.style.backgroundColor = "rgba(50,50,255,0.8)"; // 青
	    } else {
	        settingsButton.style.backgroundColor = "rgba(255,0,0,0.6)"; // 赤
	    }
	}


}

// インスタンスを作成
window.AutoRepairMod = new AutoRepairMod();
