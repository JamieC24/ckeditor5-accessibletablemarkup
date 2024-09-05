import { Rnibtablemarkup as RnibtablemarkupDll, icons } from '../src';
import Rnibtablemarkup from '../src/rnibtablemarkup';

import ckeditor from './../theme/icons/ckeditor.svg';

describe( 'CKEditor5 Rnibtablemarkup DLL', () => {
	it( 'exports Rnibtablemarkup', () => {
		expect( RnibtablemarkupDll ).to.equal( Rnibtablemarkup );
	} );

	describe( 'icons', () => {
		it( 'exports the "ckeditor" icon', () => {
			expect( icons.ckeditor ).to.equal( ckeditor );
		} );
	} );
} );
