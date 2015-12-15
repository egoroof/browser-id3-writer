describe('dependencies', function () {

    describe('ArrayBuffer', function () {
        it('should be possible to create an instance', function () {
            expect(new ArrayBuffer(0)).to.be.instanceof(ArrayBuffer);
        });
        it('should has byteLength property', function () {
            var buffer = new ArrayBuffer(8);
            expect(buffer).to.have.property('byteLength');
            expect(buffer.byteLength).to.equal(8);
        });
        it('should be possible to slice a buffer', function () {
            var buffer = new ArrayBuffer(8);
            var slicedBuffer = buffer.slice(2);
            expect(slicedBuffer.byteLength).to.equal(6);

            var slicedBuffer2 = buffer.slice(2, 6);
            expect(slicedBuffer2.byteLength).to.equal(4);
        });
    });

    describe('Uint8Array', function () {
        it('should be possible to create an instance', function () {
            expect(new Uint8Array(0)).to.be.instanceof(Uint8Array);
        });
        it('should be possible to write to ArrayBuffer', function () {
            var buffer = new ArrayBuffer(7);
            var bufferWriter = new Uint8Array(buffer);
            bufferWriter.set([3, 5, 7], 3);
            expect(bufferWriter).to.eql({0: 0, 1: 0, 2: 0, 3: 3, 4: 5, 5: 7, 6: 0});
        });
    });

    describe('TextEncoder', function () {
        it('should be possible to create an instance', function () {
            expect(new TextEncoder('utf-8')).to.be.instanceof(TextEncoder);
            expect(new TextEncoder('utf-16le')).to.be.instanceof(TextEncoder);
        });
        it('should correctly encode utf8 strings', function () {
            var coder = new TextEncoder('utf-8');
            expect(coder.encode('zero')).to.eql({0: 122, 1: 101, 2: 114, 3: 111});
        });
        it('should correctly encode utf16le strings', function () {
            var coder = new TextEncoder('utf-16le');
            expect(coder.encode('зеро')).to.eql({0: 55, 1: 4, 2: 53, 3: 4, 4: 64, 5: 4, 6: 62, 7: 4});
        });
    });

    describe('Blob', function () {
        it('should be possible to create an instance', function () {
            expect(new Blob()).to.be.instanceof(Blob);
        });
        it('should be possible to change type', function () {
            var blob = new Blob([], {type: 'audio/mpeg'});
            expect(blob.type).to.be.equal('audio/mpeg');
        });
    });

    describe('URL', function () {
        it('createObjectURL without arguments should throw TypeError', function () {
            expect(URL.createObjectURL).to.throw(TypeError);
        });
        it('createObjectURL should return a string', function () {
            expect(URL.createObjectURL(new Blob())).to.be.a('string');
        });
        it('revokeObjectURL without arguments should throw TypeError', function () {
            expect(URL.revokeObjectURL).to.throw(TypeError);
        });
        it('revokeObjectURL should return undefined', function () {
            expect(URL.revokeObjectURL('')).to.be.an('undefined');
        });
    });

});
