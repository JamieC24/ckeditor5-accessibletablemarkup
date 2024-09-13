import { Plugin, TableEditing } from 'ckeditor5';

export default class Rnibtablemarkup extends Plugin {
	static get requires() {
		return [TableEditing];
	}

	static get pluginName() {
		return 'Rnibtablemarkup';
	}

	init() {
		const editor = this.editor;

		editor.conversion.for('downcast').add((dispatcher) => {
			dispatcher.on('insert:table', (evt, data, conversionApi) => {
				const viewWriter = conversionApi.writer;
				const modelTable = data.item;

				// Ensure the modelTable is correctly mapped to a view element
				let tableWrapper =
					conversionApi.mapper.toViewElement(modelTable);
				if (tableWrapper && tableWrapper.name === 'figure') {
					// Save the contentToolbar configuration
					const contentToolbar = editor.config.get(
						'table.contentToolbar'
					);
					// Create a new div element
					const div = viewWriter.createContainerElement('div', {
						class: 'table-wrap',
					});

					// Move all children from the figure to the div
					while (tableWrapper.getChild(0)) {
						const child = tableWrapper.getChild(0);
						viewWriter.move(
							viewWriter.createRangeOn(child),
							viewWriter.createPositionAt(div, 'end')
						);
					}

					// Copy attributes and classes from the figure to the div
					for (const attribute of tableWrapper.getAttributes()) {
						viewWriter.setAttribute(
							attribute[0],
							attribute[1],
							div
						);
					}
					for (const className of tableWrapper.getClassNames()) {
						viewWriter.addClass(className, div);
					}

					// Copy custom properties from the figure to the div
					const customProperties = tableWrapper.getCustomProperties();
					for (const [key, value] of customProperties) {
						viewWriter.setCustomProperty(key, value, div);
					}

					// Replace the figure with the div
					viewWriter.insert(
						viewWriter.createPositionBefore(tableWrapper),
						div
					);
					viewWriter.remove(tableWrapper);
					// Update the mapping in the conversion API
					conversionApi.mapper.bindElements(modelTable, div);
				}
			});
		});
	}
	afterInit() {
		const editor = this.editor;
		// Handle the insertion of table captions
		editor.conversion.for('downcast').add((dispatcher) => {
			dispatcher.on('insert:caption', (evt, data, conversionApi) => {
				const viewWriter = conversionApi.writer;
				const modelCaption = data.item;

				// Ensure the modelCaption is correctly mapped to a view element
				let captionWrapper =
					conversionApi.mapper.toViewElement(modelCaption);
				if (captionWrapper && captionWrapper.name === 'figcaption') {
					const captionTag = viewWriter.createContainerElement(
						'caption',
						{
							class: 'table-caption',
						}
					);

					while (captionWrapper.getChild(0)) {
						const child = captionWrapper.getChild(0);
						viewWriter.move(
							viewWriter.createRangeOn(child),
							viewWriter.createPositionAt(captionTag, 'end')
						);
					}

					for (const attribute of captionWrapper.getAttributes()) {
						viewWriter.setAttribute(
							attribute[0],
							attribute[1],
							captionTag
						);
					}
					for (const className of captionWrapper.getClassNames()) {
						viewWriter.addClass(className, captionTag);
					}

					const captionCustomProperties =
						captionWrapper.getCustomProperties();
					for (const [key, value] of captionCustomProperties) {
						viewWriter.setCustomProperty(key, value, captionTag);
					}

					const model = editor.model;
					let tableElement = null;
					model.change((writer) => {
						const root = model.document.getRoot();
						for (const child of root.getChildren()) {
							if (child.is('element', 'table')) {
								tableElement = child;
								break;
							}
						}
					});

					if (tableElement) {
						viewWriter.insert(
							viewWriter.createPositionAt(
								conversionApi.mapper.toViewElement(
									tableElement
								),
								0
							),
							captionTag
						);
						viewWriter.remove(captionWrapper);
						conversionApi.mapper.bindElements(
							modelCaption,
							captionTag
						);
					} else {
						console.log('Table element not found for caption');
					}
				}
			});
		});
	}
}
