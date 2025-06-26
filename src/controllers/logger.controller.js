const testLogs = (req, res) => {
    req.logger.fatal('Este es un log fatal');
    req.logger.error('Este es un log de error');
    req.logger.warning('Este es un log de advertencia');
    req.logger.info('Este es un log de información');
    req.logger.http('Este es un log http');
    req.logger.debug('Este es un log de debug');
    res.send('Logs probados');
};

export default {
    testLogs
};