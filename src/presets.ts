import { CompanionPresetDefinitions } from '@companion-module/base'
import type { ModuleInstance } from './main.js'
import { combineRgb } from '@companion-module/base'
import { Control } from './api-service.js'

export function UpdatePresetDefinitions(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}

	//component presets
	self.data.controls.forEach((control: Control) => {
		presets[`toggle_${control.component}`] = {
			type: 'button',
			category: 'Components',
			name: `${control.component}`,
			style: {
				text: `${control.component.toUpperCase()}`,
				size: 'auto',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 0),
			},
			feedbacks: [
				{
					feedbackId: 'componentState',
					options: {
						component: control.component,
					},
					style: {
						bgcolor: combineRgb(255, 0, 0),
						color: combineRgb(255, 255, 255),
					},
				},
			],
			steps: [
				{
					down: [
						{
							actionId: 'toggle_component',
							options: {
								component: control.component,
							},
						},
					],
					up: [],
				},
			],
		}
	})

	// Presets for selecting players from the away lineup
	fillPresetsWithLineup(true)
	fillPresetsWithLineup(false)

	function fillPresetsWithLineup(away: boolean): void {
		const team: string = away ? 'away' : 'home'
		const lineup: string = away ? 'awayLineup' : 'homeLineup'
		for (let i = 1; i <= 9; i++) {
			presets[`select_${team}_player_${i}`] = {
				type: 'button',
				category: 'Lineup Selection',
				name: `Batter ${i}`,
				style: {
					text: `${i}.$(ballscore-broadcast:${lineup}Name${i})`,
					size: 'auto',
					color: away ? combineRgb(255, 255, 255) : combineRgb(0, 0, 0),
					bgcolor: away ? combineRgb(0, 0, 0) : combineRgb(255, 255, 255),
				},
				feedbacks: [
					{
						feedbackId: 'playerState',
						options: {
							team: lineup,
							lineupSpot: i,
						},
						style: {
							bgcolor: combineRgb(255, 0, 0),
						},
					},
					{
						feedbackId: 'batterState',
						options: {
							team: lineup,
							lineupSpot: i,
						},
						style: {
							color: combineRgb(0, 255, 0),
						},
					},
				],
				steps: [
					{
						down: [
							{
								actionId: 'select_from_lineup',
								options: {
									team: lineup,
									num: i,
								},
							},
						],
						up: [],
					},
				],
			}
		}
	}

	self.setPresetDefinitions(presets)
}
