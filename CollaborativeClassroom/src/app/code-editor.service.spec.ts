import { TestBed } from '@angular/core/testing';

import { CodeEditorService } from './code-editor.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CodeEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule], 
    providers: [CodeEditorService]
  }));

  it('should be created', () => {
    const service: CodeEditorService = TestBed.get(CodeEditorService);
    expect(service).toBeTruthy();
  });
});
