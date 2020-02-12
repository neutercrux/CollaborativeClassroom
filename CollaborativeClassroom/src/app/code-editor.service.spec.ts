import { TestBed } from '@angular/core/testing';

import { CodeEditorService } from './code-editor.service';

describe('CodeEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CodeEditorService = TestBed.get(CodeEditorService);
    expect(service).toBeTruthy();
  });
});
