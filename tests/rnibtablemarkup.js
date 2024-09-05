import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Rnibtablemarkup from '../src/rnibtablemarkup';

/* global document */

describe( 'Rnibtablemarkup', () => {
	it( 'should be named', () => {
		expect( Rnibtablemarkup.pluginName ).to.equal( 'Rnibtablemarkup' );
	} );

	describe( 'init()', () => {
		let domElement, editor;

		beforeEach( async () => {
			domElement = document.createElement( 'div' );
			document.body.appendChild( domElement );

			editor = await ClassicEditor.create( domElement, {
				plugins: [
					Paragraph,
					Heading,
					Essentials,
					Rnibtablemarkup
				],
				toolbar: [
					'rnibtablemarkupButton'
				]
			} );
		} );

		afterEach( () => {
			domElement.remove();
			return editor.destroy();
		} );

		it( 'should load Rnibtablemarkup', () => {
			const myPlugin = editor.plugins.get( 'Rnibtablemarkup' );

			expect( myPlugin ).to.be.an.instanceof( Rnibtablemarkup );
		} );

		it( 'should add an icon to the toolbar', () => {
			expect( editor.ui.componentFactory.has( 'rnibtablemarkupButton' ) ).to.equal( true );
		} );

		it( 'should add a text into the editor after clicking the icon', () => {
			const icon = editor.ui.componentFactory.create( 'rnibtablemarkupButton' );

			expect( editor.getData() ).to.equal( '' );

			icon.fire( 'execute' );

			expect( editor.getData() ).to.equal( '<p>Hello CKEditor 5!</p>' );
		} );
	} );
} );
